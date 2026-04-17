import {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import type {AlertColor} from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Slider from "@mui/material/Slider";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import NumbersIcon from "@mui/icons-material/Numbers";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {generatePassword} from "../lib/PasswordLogic";

function PasswordGenerator({keyValue}: {keyValue: number}) {
  const [name, setName] = useState("");
  const [no, setNo] = useState(0);
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");

  const showAlert = (message: string, severity: AlertColor) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleContentCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showAlert("Text copied to clipboard", "success"))
      .catch((err: Error) => showAlert(err.message, "error"));
  };

  const handleGeneratePassword = () => {
    if (!keyValue) {
      showAlert("Please set your Secret Key", "warning");
      return;
    }
    const generatedPassword = generatePassword(keyValue, name, no, length);
    setPassword(generatedPassword);
    handleContentCopy(generatedPassword);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        (document.activeElement as HTMLElement | null)?.blur();
        const generateButton = document.getElementById("generate");
        setTimeout(() => generateButton?.click(), 0);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <div className="flex-column gap-y-4">
            <Typography variant="h6" sx={{fontWeight: 700}}>
              Password Generator
            </Typography>

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="site-name">Site Name</InputLabel>
              <OutlinedInput
                id="site-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon/>
                  </InputAdornment>
                }
                label="Site Name"
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="number">Number</InputLabel>
              <OutlinedInput
                id="number"
                type="number"
                value={no}
                onChange={(e) => setNo(parseInt(e.target.value) || 0)}
                startAdornment={
                  <InputAdornment position="start">
                    <NumbersIcon/>
                  </InputAdornment>
                }
                label="Number"
              />
            </FormControl>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Password Length: {length}
              </Typography>
              <Slider
                value={length}
                onChange={(_, newValue) => setLength(typeof newValue === "number" ? newValue : newValue[0])}
                min={8}
                max={32}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              id="generate"
              fullWidth
              variant="contained"
              onClick={handleGeneratePassword}
            >
              Generate Password
            </Button>

            {password && (
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="generated-password">Generated Password</InputLabel>
                <OutlinedInput
                  id="generated-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  endAdornment={
                    <InputAdornment position="end" sx={{gap: 1}}>
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                      </IconButton>
                      <IconButton onClick={() => handleContentCopy(password)} edge="end">
                        <ContentCopyIcon/>
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Generated Password"
                />
              </FormControl>
            )}
          </div>
        </CardContent>
      </Card>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: "100%"}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PasswordGenerator;
