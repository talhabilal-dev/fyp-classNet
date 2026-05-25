import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TeacherPage } from "./pages/TeacherPage";
import { JoinPage } from "./pages/JoinPage";
import { ReportsPage } from "./pages/ReportsPage";
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(TeacherPage, {}) }), _jsx(Route, { path: "/join/:code", element: _jsx(JoinPage, {}) }), _jsx(Route, { path: "/reports", element: _jsx(ReportsPage, {}) })] }) }));
}
