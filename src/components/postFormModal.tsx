import React, { useState } from "react";
import Cookies from "js-cookie";
import "./createPostPage.css";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
} from "@mui/material";

const PostFormModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  const accessToken = Cookies.get("accessToken");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (activeStep < 2) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Failed to create post: ${response.statusText}`);

      const result = await response.json();
      console.log("Post created successfully:", result);

      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6">Create a New Post</Typography>
        <Stepper activeStep={activeStep}>
          {["Step 1", "Step 2", "Step 3"].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && (
            <TextField
              label="Post Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
          )}
          {activeStep === 1 && (
            <TextField
              label="Post Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          )}
          {activeStep === 2 && (
            <TextField
              label="Post Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep < 2 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PostFormModal;
