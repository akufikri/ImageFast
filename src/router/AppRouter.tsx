import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layout";
import Home from "../pages/Home";
import Editor from "../pages/Editor";
import EditorLayout from "../layout/editor";

export default function AppRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/editor"
            element={
              <EditorLayout>
                <Editor />
              </EditorLayout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
