import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography } from "@mui/material";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <Box
      className="main-content"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        className="auth-container"
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#fff",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome
        </Typography>

        {currentUser && (
          <>
            <Typography variant="h6" className="mb-2">
              Username: {currentUser.displayName || "N/A"}
            </Typography>
            <Typography variant="body1" className="mb-4">
              Email: {currentUser.email}
            </Typography>
          </>
        )}

        <Button variant="contained" color="primary" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
}
