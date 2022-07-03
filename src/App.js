import Home from "./pages/Home";
import Create from "./pages/Create";
import Box from '@mui/material/Box';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Box
    height="100%"
    width="100%"
    p="0"
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<Create/>} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
