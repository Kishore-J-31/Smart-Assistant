
import React, { useState } from 'react';

const AdminDashboard = ({ documents, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });

  const extractPdfText = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ") + "\n";
          }
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.pdfFile;
    const file = fileInput?.files[0];

    if (!file && !formData.content) {
      alert("Please provide content or a PDF.");
      return;
    }

    setLoading(true);
    try {
      let content = formData.content;
      let title = formData.title;
      let sourceType = "Manual";

      if (file) {
        content = await extractPdfText(file);
        title = title || file.name;
        sourceType = "PDF";
      }

      const newDoc = {
        id: Date.now(),
        title,
        content,
        category: formData.category,
        source_type: sourceType,
        created_at: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('smart_support_docs') || '[]');
      localStorage.setItem('smart_support_docs', JSON.stringify([newDoc, ...existing]));
      
      setFormData({ title: '', content: '', category: 'General' });
      setIsAdding(false);
      onRefresh();
    } catch (err) {
      alert("Error parsing document. Please ensure it's a valid PDF.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Delete this document?")) {
      const existing = JSON.parse(localStorage.getItem('smart_support_docs') || '[]');
      const filtered = existing.filter(d => d.id !== id);
      localStorage.setItem('smart_support_docs', JSON.stringify(filtered));
      onRefresh();
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">Knowledge Base</h2>
          <p className="text-muted">Manage the information your AI assistant uses for grounding.</p>
        </div>
        <button 
          className={`btn rounded-pill px-4 py-2 fw-medium ${isAdding ? 'btn-outline-secondary' : 'btn-primary'}`}
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : <><i className="fas fa-plus me-2"></i>Add Content</>}
        </button>
      </div>

      {isAdding && (
        <div className="card shadow border-0 rounded-4 mb-5 animate__animated animate__fadeIn">
          <div className="card-body p-4 p-md-5">
            <h4 className="fw-bold mb-4">Add Knowledge</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-8">
                  <label className="form-label small fw-bold text-uppercase">Title</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light border-0" 
                    placeholder="e.g. Return Policy 2024"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-uppercase">Category</label>
                  <select 
                    className="form-select form-select-lg bg-light border-0"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>General</option>
                    <option>Technical</option>
                    <option>Billing</option>
                    <option>Product Guide</option>
                  </select>
                </div>
                <div className="col-12">
                  <div className="p-4 border-2 border-dashed rounded-4 bg-light text-center mb-3">
                    <label className="form-label d-block mb-3">
                      <i className="fas fa-file-pdf fs-1 text-primary mb-2"></i>
                      <div className="fw-bold">Upload PDF Document</div>
                      <div className="small text-muted">We'll automatically extract the text for indexing.</div>
                    </label>
                    <input type="file" name="pdfFile" className="form-control" accept=".pdf" />
                  </div>
                </div>
                <div className="col-12 text-center text-muted mb-2">OR</div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-uppercase">Paste Manual Text</label>
                  <textarea 
                    className="form-control bg-light border-0" 
                    rows={6}
                    placeholder="Enter manual documentation here..."
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  ></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-dark btn-lg w-100 rounded-pill py-3 fw-bold" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Indexing Content...</>
                    ) : 'Ground AI with this Knowledge'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-4">
        {documents.length === 0 ? (
          <div className="col-12 text-center py-5 border-2 border-dashed rounded-4 bg-white opacity-75">
            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
            <h5 className="text-muted fw-bold">No documentation yet</h5>
            <p className="text-muted small">Upload content to enable AI responses grounded in your data.</p>
          </div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 card-doc">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3">
                      {doc.category}
                    </span>
                    <button onClick={() => handleDelete(doc.id)} className="btn btn-link text-danger p-0">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{doc.title}</h5>
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-light text-dark border fw-normal">
                      <i className={`fas ${doc.source_type === 'PDF' ? 'fa-file-pdf' : 'fa-keyboard'} me-1`}></i>
                      {doc.source_type}
                    </span>
                  </div>
                  <p className="text-muted small" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {doc.content}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
                  <hr className="my-2 opacity-25" />
                  <small className="text-muted">Indexed {new Date(doc.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
