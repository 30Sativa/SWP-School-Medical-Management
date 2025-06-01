import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    
    </Routes>
  );
};

export default AppRouter;
