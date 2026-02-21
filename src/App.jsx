import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Shell from "./app/layout/Shell";
import CareerSimulator from "./app/pages/CareerSimulator";
import SkillGap from "./app/pages/SkillGap";
import Analytics from "./app/pages/Analytics";
import ResumeUpload from "./app/pages/ResumeUpload";
import Settings from "./app/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          {/* Default redirect to /career */}
          <Route index element={<Navigate to="/career" replace />} />
          <Route path="career" element={<CareerSimulator />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="upload" element={<ResumeUpload />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
