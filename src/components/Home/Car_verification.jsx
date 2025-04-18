import React, { useState } from 'react';
import { CheckCircle, UploadCloud, FileText, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const mockUploads = [
    { id: 1, name: "John Doe", rc: "rc_image.jpg", puc: "puc_image.jpg", insurance: "insurance_image.jpg" },
    { id: 2, name: "Jane Smith", rc: "rc_image2.jpg", puc: "puc_image2.jpg", insurance: "insurance_image2.jpg" }
];

export default function CarDocumentManager() {
    const [rc, setRC] = useState(null);
    const [puc, setPUC] = useState(null);
    const [insurance, setInsurance] = useState(null);
    const [documents, setDocuments] = useState(mockUploads);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleFileChange = (setter) => (event) => {
        const file = event.target.files[0];
        setter(file);
    };

    const handleSubmit = () => {
        if (!rc || !puc || !insurance) {
            toast.error("Please upload all required documents!");
            return;
        }
        toast.success("Documents uploaded successfully!");
        setRC(null);
        setPUC(null);
        setInsurance(null);
    };

    const approveDocument = () => {
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDoc.id));
        setSelectedDoc(null);
        toast.success(" Document Approved Successfully!");
    };

    const rejectDocument = () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection!");
            return;
        }
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDoc.id));
        setSelectedDoc(null);
        setRejectionReason("");
        toast.success("❌ Document Rejected Successfully!");
    };

    return (
        <div className={`min-h-screen p-8 relative ${selectedDoc ? 'overflow-hidden' : ''}`}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex justify-center mb-8">
                <button
                    onClick={() => setIsReviewMode(false)}
                    className={`px-5 py-2 font-medium rounded-l-full transition-all duration-300 ${!isReviewMode ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-600'}`}
                >
                    Upload Document
                </button>
                <button
                    onClick={() => setIsReviewMode(true)}
                    className={`px-5 py-2 font-medium rounded-r-full transition-all duration-300 ${isReviewMode ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-600'}`}
                >
                    Review Document
                </button>
            </div>

            {isReviewMode ? (
                <div>
                    <h2 className="text-4xl font-bold text-center mb-10 text-white">Verify Car Documents</h2>
                    <div className="grid gap-6 max-w-5xl mx-auto">
                        {documents.length === 0 ? (
                            <p className="text-center text-gray-500">No pending documents.</p>
                        ) : (
                            documents.map((doc) => (
                                <div key={doc.id} className="bg-white p-6 shadow-md rounded-2xl border border-gray-200">
                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                        <FileText className="text-emerald-500" size={20} /> {doc.name}
                                    </h3>
                                    <ul className="space-y-2 mb-4 text-gray-700">
                                        <li>RC: <a href={`/${doc.rc}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">View</a></li>
                                        <li>PUC: <a href={`/${doc.puc}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">View</a></li>
                                        <li>Insurance: <a href={`/${doc.insurance}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">View</a></li>
                                    </ul>
                                    <button
                                        onClick={() => setSelectedDoc(doc)}
                                        className="bg-emerald-500 text-white flex items-center gap-2 px-4 py-2 rounded-full hover:bg-emerald-600 transition-all"
                                    >
                                        <CheckCircle size={18} /> Verify Documents
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h2 className="text-4xl font-bold mb-8 text-white">Upload Car Documents</h2>
                    <div className="space-y-6 w-full max-w-md bg-white bg-opacity-95 p-6 shadow-lg rounded-2xl border border-gray-200 backdrop-blur">
                        <div>
                            <label className="block font-medium mb-2 text-gray-700">Registration Certificate (RC)</label>
                            <input type="file" accept="image/*" onChange={handleFileChange(setRC)} className="w-full border border-gray-300 rounded-lg p-2" />
                        </div>
                        <div>
                            <label className="block font-medium mb-2 text-gray-700">PUC Certificate</label>
                            <input type="file" accept="image/*" onChange={handleFileChange(setPUC)} className="w-full border border-gray-300 rounded-lg p-2" />
                        </div>
                        <div>
                            <label className="block font-medium mb-2 text-gray-700">Insurance Copy</label>
                            <input type="file" accept="image/*" onChange={handleFileChange(setInsurance)} className="w-full border border-gray-300 rounded-lg p-2" />
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-emerald-500 text-white flex justify-center items-center gap-2 py-2 rounded-full hover:bg-emerald-600 transition-all"
                        >
                            <UploadCloud size={18} /> Submit Documents
                        </button>
                    </div>
                </div>
            )}

            {selectedDoc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    
                tabIndex={-1}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4">Verify {selectedDoc.name}'s Documents</h3>
                        {rejectionReason === "" ? (
                            <div className="flex justify-between">
                                <button
                                    onClick={approveDocument}
                                    className="bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-emerald-600 transition-all"
                                >
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button
                                    onClick={() => setRejectionReason(" ")}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition-all"
                                >
                                    <XCircle size={18} /> Reject
                                </button>
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                                    placeholder="Enter rejection reason..."
                                    value={rejectionReason.trim()}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <div className="flex justify-between">
                                    <button
                                        onClick={rejectDocument}
                                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
                                    >
                                        Submit Rejection
                                    </button>
                                    <button
                                        onClick={() => { setRejectionReason(""); setSelectedDoc(null); }}
                                        className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
