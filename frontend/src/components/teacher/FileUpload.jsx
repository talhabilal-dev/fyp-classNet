import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
function categoryIcon(category) {
    if (category === "pdf")
        return "📄";
    if (category === "image")
        return "🖼️";
    if (category === "video")
        return "🎥";
    if (category === "document")
        return "📝";
    return "📎";
}
function formatSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function FileUpload({ sessionId, files, onFileUploaded, onFileDeleted }) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const uploadFile = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${BACKEND_URL}/api/files/${sessionId}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            onFileUploaded(data);
        }
        catch (err) {
            console.error("Upload failed:", err);
        }
        finally {
            setUploading(false);
        }
    };
    const deleteFile = async (fileId) => {
        await fetch(`${BACKEND_URL}/api/files/${sessionId}/${fileId}`, {
            method: "DELETE",
        });
        onFileDeleted(fileId);
    };
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-zinc-800 flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h2", { className: "text-white font-semibold", children: "File Sharing" }), _jsxs("p", { className: "text-zinc-500 text-xs mt-0.5", children: [files.length, " file", files.length !== 1 ? "s" : "", " shared"] })] }) }), _jsxs("div", { className: "p-5 flex flex-col gap-4", children: [_jsx("div", { onDrop: (e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const f = e.dataTransfer.files[0];
                            if (f)
                                uploadFile(f);
                        }, onDragOver: (e) => { e.preventDefault(); setDragOver(true); }, onDragLeave: () => setDragOver(false), className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-700 hover:border-zinc-600"}`, children: uploading ? (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin" }), _jsx("p", { className: "text-zinc-500 text-sm", children: "Uploading..." })] })) : (_jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("span", { className: "text-3xl", children: "\uD83D\uDCC1" }), _jsx("p", { className: "text-zinc-500 text-sm", children: "Drag & drop or" }), _jsxs("label", { className: "cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors", children: ["Browse File", _jsx("input", { type: "file", className: "hidden", onChange: (e) => e.target.files?.[0] && uploadFile(e.target.files[0]), disabled: uploading })] })] })) }), files.length > 0 && (_jsx("div", { className: "flex flex-col divide-y divide-zinc-800 rounded-xl overflow-hidden border border-zinc-800", children: files.map((file) => (_jsxs("div", { className: "flex items-center justify-between px-4 py-3.5 bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 bg-zinc-700 rounded-xl flex items-center justify-center text-lg", children: categoryIcon(file.category) }), _jsxs("div", { children: [_jsx("p", { className: "text-white text-sm font-medium truncate max-w-56", children: file.originalName }), _jsx("p", { className: "text-zinc-500 text-xs", children: formatSize(file.sizeBytes) })] })] }), _jsx("button", { onClick: () => deleteFile(file.fileId), className: "text-red-400 hover:text-white text-xs bg-red-500/10 hover:bg-red-500 px-2.5 py-1 rounded-lg transition-all", children: "Delete" })] }, file.fileId))) }))] })] }));
}
