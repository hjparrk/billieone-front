import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/layout/PageLayout";
import { LessonList } from "./components/lesson/LessonList";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";

function App() {
    return (
        <Router>
            <PageLayout>
                <Routes>
                    <Route path="/" element={<LessonList />} />
                    <Route path="/teachers/:teacherId" element={<TeacherDashboard />} />
                </Routes>
            </PageLayout>
        </Router>
    );
}

export default App;
