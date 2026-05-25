import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { TeacherPage } from "./pages/TeacherPage";
import { StudentPage } from "./pages/StudentPage";
import { JoinPage } from "./pages/JoinPage";
import { ReportsPage } from "./pages/ReportsPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full flex flex-col gap-4">
                                <h1 className="text-white text-2xl font-bold">ClassNet</h1>
                                <p className="text-zinc-400 text-sm">Choose your role to continue</p>
                                <div className="flex gap-3">
                                    <Link to="/teacher" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg">Teacher</Link>
                                    <Link to="/student" className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-lg">Student</Link>
                                </div>
                            </div>
                        </div>
                    }
                />
                <Route path="/teacher" element={<TeacherPage /> } />
                <Route path="/student" element={<StudentPage />} />
                <Route path="/join/:code" element={<JoinPage />} />
                <Route path="/reports" element={<ReportsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
