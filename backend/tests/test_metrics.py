"""Stage 4 metrics switch (DATA_FLOW_GUIDE.md SS5.1, .claude/rules/backend.md).

Branches by model_type -- CLAUDE.md: "model_type is a switch, not
documentation." One test class per branch, plus the degenerate cases the
switch has to handle without raising: a single cluster, all-noise
clustering output, and an unrecognised model_type.
"""
import numpy as np
import pytest

from app.core.metrics import compute_metrics


class TestClassifierMetrics:
    def test_perfect_predictions(self):
        y_true = np.array([0, 1, 0, 1, 2, 2])
        y_pred = np.array([0, 1, 0, 1, 2, 2])
        metrics = compute_metrics("classifier", X=np.zeros((6, 1)), y_true=y_true, y_pred=y_pred)
        assert metrics["accuracy"] == 1.0
        assert metrics["precision"] == 1.0
        assert metrics["recall"] == 1.0
        assert metrics["f1"] == 1.0
        assert metrics["confusion_matrix"] == [[2, 0, 0], [0, 2, 0], [0, 0, 2]]
        assert metrics["labels"] == ["0", "1", "2"]

    def test_wrong_predictions_lower_accuracy(self):
        y_true = np.array([0, 0, 1, 1])
        y_pred = np.array([0, 1, 1, 0])
        metrics = compute_metrics("classifier", X=np.zeros((4, 1)), y_true=y_true, y_pred=y_pred)
        assert metrics["accuracy"] == 0.5

    def test_requires_y_true(self):
        with pytest.raises(ValueError, match="y_true"):
            compute_metrics("classifier", X=np.zeros((2, 1)), y_true=None, y_pred=np.array([0, 1]))


class TestRegressorMetrics:
    def test_perfect_predictions(self):
        y_true = np.array([1.0, 2.0, 3.0])
        y_pred = np.array([1.0, 2.0, 3.0])
        metrics = compute_metrics("regressor", X=np.zeros((3, 1)), y_true=y_true, y_pred=y_pred)
        assert metrics["mse"] == 0.0
        assert metrics["rmse"] == 0.0
        assert metrics["r2"] == 1.0
        assert metrics["mae"] == 0.0

    def test_known_errors(self):
        y_true = np.array([0.0, 0.0])
        y_pred = np.array([1.0, 3.0])
        metrics = compute_metrics("regressor", X=np.zeros((2, 1)), y_true=y_true, y_pred=y_pred)
        assert metrics["mse"] == 5.0
        assert metrics["mae"] == 2.0

    def test_requires_y_true(self):
        with pytest.raises(ValueError, match="y_true"):
            compute_metrics("regressor", X=np.zeros((2, 1)), y_true=None, y_pred=np.array([0.0, 1.0]))


class TestClustererMetrics:
    def test_well_separated_clusters_score_well(self):
        rng = np.random.default_rng(42)
        cluster_a = rng.normal(loc=-10, scale=0.1, size=(20, 2))
        cluster_b = rng.normal(loc=10, scale=0.1, size=(20, 2))
        X = np.vstack([cluster_a, cluster_b])
        labels = np.array([0] * 20 + [1] * 20)

        metrics = compute_metrics("clusterer", X=X, y_true=None, y_pred=labels)
        assert metrics["silhouette_score"] > 0.9
        assert metrics["davies_bouldin_score"] < 0.5
        assert metrics["inertia"] > 0.0

    def test_single_cluster_is_undefined_not_an_error(self):
        X = np.zeros((10, 2))
        labels = np.zeros(10, dtype=int)
        metrics = compute_metrics("clusterer", X=X, y_true=None, y_pred=labels)
        assert metrics["silhouette_score"] is None
        assert metrics["davies_bouldin_score"] is None

    def test_noise_never_relabelled_and_all_noise_gives_none_inertia(self):
        X = np.zeros((5, 2))
        labels = np.full(5, -1)
        metrics = compute_metrics("clusterer", X=X, y_true=None, y_pred=labels)
        assert metrics["inertia"] is None

    def test_noise_excluded_from_centroid_but_kept_as_label(self):
        X = np.array([[0.0, 0.0], [0.0, 0.0], [100.0, 100.0]])
        labels = np.array([0, 0, -1])
        metrics = compute_metrics("clusterer", X=X, y_true=None, y_pred=labels)
        # Only cluster 0's two identical points contribute; the noise point
        # contributes nothing, so inertia is exactly 0, not skewed by it.
        assert metrics["inertia"] == 0.0


class TestDimensionalityReducerMetrics:
    def test_explained_variance_ratio_length_matches_components(self):
        rng = np.random.default_rng(42)
        X = rng.standard_normal((50, 5))
        transformed = X[:, :2]  # stand-in 2-component projection
        metrics = compute_metrics(
            "dimensionality_reducer", X=X, y_true=None, y_pred=transformed,
        )
        assert len(metrics["explained_variance_ratio"]) == 2
        assert all(isinstance(v, float) for v in metrics["explained_variance_ratio"])


def test_unrecognised_model_type_raises():
    with pytest.raises(ValueError, match="Unrecognised model_type"):
        compute_metrics("regression_tree_ensemble", X=np.zeros((1, 1)), y_true=None, y_pred=np.zeros(1))
