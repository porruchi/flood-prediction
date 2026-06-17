import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/pawpaw_test/register",
        formData
      );
      if (response.data.success) {
        alert("Registration successful!");
        navigate("/login"); // นำไปยังหน้า Login
      } else {
        alert(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error(error.response?.data);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Grid
        container
        sx={{
          maxWidth: "900px",
          height: "500px",
          boxShadow: 3,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {" "}
        {/* Left Side - Welcome Back Message */}{" "}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: "#26a69a",
            color: "#fff",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome Back!
          </Typography>{" "}
          <Typography
            variant="body1"
            sx={{ marginBottom: "2rem", textAlign: "center" }}
          >
            To keep connected with us please login with your personal info.{" "}
          </Typography>{" "}
          <Link to="/login">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#26a69a",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Sign In{" "}
            </Button>{" "}
          </Link>{" "}
        </Grid>
        {/* Right Side - Create Account Form */}{" "}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundColor: "#fff",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
            Create Account{" "}
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
            />
            <Button
              variant="contained"
              type="submit"
              color="primary"
              sx={{ marginTop: "1rem" }}
            >
              Sign Up{" "}
            </Button>{" "}
          </Box>{" "}
        </Grid>{" "}
      </Grid>{" "}
    </Box>
  );
};

export default Register;
