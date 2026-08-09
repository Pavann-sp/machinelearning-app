function FileUpload() {
  return (
    <div className="section">
      <label htmlFor="dataset">Upload Dataset</label>

      <input
        id="dataset"
        type="file"
        accept=".csv"
      />
    </div>
  );
}

export default FileUpload;