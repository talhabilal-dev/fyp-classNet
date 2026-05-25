import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
export function SessionQRCode({ sessionCode, lanUrl }) {
    const [showQR, setShowQR] = useState(false);
    if (!showQR) {
        return (_jsxs("button", { onClick: () => setShowQR(true), className: "flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 px-3 rounded-lg transition-colors w-full justify-center", children: [_jsx("span", { children: "\uD83D\uDCF1" }), " Show QR Code"] }));
    }
    return (_jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "bg-white p-3 rounded-xl", children: _jsx(QRCodeSVG, { value: lanUrl, size: 160, bgColor: "#ffffff", fgColor: "#000000", level: "M" }) }), _jsx("p", { className: "text-zinc-500 text-xs text-center", children: "Students scan to join directly" }), _jsx("button", { onClick: () => setShowQR(false), className: "text-zinc-600 hover:text-zinc-400 text-xs transition-colors", children: "Hide QR" })] }));
}
