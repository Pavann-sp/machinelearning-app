"""Model registry -- explicit manifest, never directory scanning.

Registers only the four conformance references: the classifier reference
in backend/models/example_logistic_regression/, and the clusterer,
regressor, and dimensionality_reducer references in
backend/tests/reference_models/.

Group submissions under backend/models/group_*/ are never imported here
until explicitly instructed (see CLAUDE.md "Current state").

group_03_rnn (explicitly instructed) is the first group submission
registered. It ships three regressor architectures -- RNNModel, LSTMModel,
GRUModel -- rather than the single model.py entry point other groups use;
all three are registered here as separate manifest entries.
"""
import logging

from models.base_model import BaseModel
from models.example_logistic_regression.model import LogisticRegressionModel
from models.group_03_rnn.gru import GRUModel
from models.group_03_rnn.lstm import LSTMModel
from models.group_03_rnn.rnn import RNNModel
from tests.reference_models.ref_kmeans import RefKMeansModel
from tests.reference_models.ref_linear import RefLinearRegressionModel
from tests.reference_models.ref_pca import RefPCAModel

logger = logging.getLogger(__name__)

# One import, one manifest entry, per model.
MODEL_MANIFEST: dict[str, type] = {
    "logistic_regression": LogisticRegressionModel,
    "kmeans": RefKMeansModel,
    "linear_regression": RefLinearRegressionModel,
    "pca": RefPCAModel,
    "rnn": RNNModel,
    "lstm": LSTMModel,
    "gru": GRUModel,
}


def build_registry(manifest: dict[str, type] = MODEL_MANIFEST) -> dict[str, type[BaseModel]]:
    """Validate the manifest and return the entries that pass.

    Confirms each entry subclasses BaseModel. A bad entry is logged and
    omitted, never raised -- one broken submission must not take the
    whole registry down.
    """
    registry: dict[str, type[BaseModel]] = {}
    for name, cls in manifest.items():
        if not (isinstance(cls, type) and issubclass(cls, BaseModel)):
            logger.error(
                "Registry entry '%s' (%r) does not subclass BaseModel; "
                "omitting.", name, cls,
            )
            continue
        registry[name] = cls
    return registry


REGISTRY: dict[str, type[BaseModel]] = build_registry()
