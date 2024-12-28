import React, { useState } from "react";
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

// Stepper content
const steps = ["Step 1", "Step 2", "Step 3"];

const PostFormModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  // Handle changes in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle step change
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Handle form submission (optional)
  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
    // Add form submission logic here, like sending the data to an API
    onClose(); // Close the modal after submission
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
        <Typography variant="h6" gutterBottom>
          Create a New Post
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && (
            <Box>
              <TextField
                label="Post Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
                Next
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <TextField
                label="Post Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleNext} sx={{ ml: 2 }}>
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <TextField
                label="Post Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PostFormModal;
