import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Watch from "./pages/Watch"
import AddVideo from "./pages/AddVideo"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:youtubeId" element={<Watch />} />
        <Route path="/add" element={<AddVideo />} />
      </Routes>
    </BrowserRouter>
  )
}
