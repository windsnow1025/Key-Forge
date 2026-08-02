import {useState} from "react";
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
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {decryptAES, encryptAES} from "../lib/EncryptionLogic";

function EncryptorDecryptor({keyValue}: {keyValue: string | null}) {
  const [tabValue, setTabValue] = useState(0);
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [textToDecrypt, setTextToDecrypt] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

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

  const handleEncrypt = async () => {
    if (keyValue === null) {
      showAlert("Please set your Secret Key", "warning");
      return;
    }
    const encrypted = await encryptAES(plaintext, keyValue);
    if (!encrypted) {
      showAlert("Encryption failed", "error");
      return;
    }
    setCiphertext(encrypted);
    handleContentCopy(encrypted);
  };

  const handleDecrypt = async () => {
    if (keyValue === null) {
      showAlert("Please set your Secret Key", "warning");
      return;
    }
    try {
      const decrypted = await decryptAES(textToDecrypt, keyValue);
      if (!decrypted) {
        throw new Error("Decryption failed");
      }
      setDecryptedText(decrypted);
      handleContentCopy(decrypted);
    } catch (err) {
      showAlert((err as Error).message, "error");
    }
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <div className="flex-column gap-y-4">
            <Typography variant="h6" sx={{fontWeight: 700}}>
              AES Encryption / Decryption
            </Typography>

            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
              <Tabs
                value={tabValue}
                onChange={(_event, newValue) => setTabValue(newValue)}
                aria-label="AES operations"
              >
                <Tab label="Encrypt" value={0}/>
                <Tab label="Decrypt" value={1}/>
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <div className="flex-column gap-y-4">
                <TextField
                  fullWidth
                  label="Text to Encrypt"
                  multiline
                  maxRows={5}
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                      e.preventDefault();
                      handleEncrypt();
                    }
                  }}
                  variant="outlined"
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LockIcon/>}
                  onClick={handleEncrypt}
                >
                  Encrypt
                </Button>
                {ciphertext && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Encrypted Text
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <OutlinedInput
                        multiline
                        rows={3}
                        value={ciphertext}
                        readOnly
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleContentCopy(ciphertext)} edge="end">
                              <ContentCopyIcon/>
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Box>
                )}
              </div>
            )}

            {tabValue === 1 && (
              <div className="flex-column gap-y-4">
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="text-to-decrypt">Text to Decrypt</InputLabel>
                  <OutlinedInput
                    id="text-to-decrypt"
                    type="text"
                    multiline
                    rows={3}
                    value={textToDecrypt}
                    onChange={(e) => setTextToDecrypt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === "Enter") {
                        e.preventDefault();
                        handleDecrypt();
                      }
                    }}
                    label="Text to Decrypt"
                  />
                </FormControl>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LockOpenIcon/>}
                  onClick={handleDecrypt}
                >
                  Decrypt
                </Button>
                {decryptedText && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Decrypted Text
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <OutlinedInput
                        multiline
                        maxRows={5}
                        value={decryptedText}
                        readOnly
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleContentCopy(decryptedText)} edge="end">
                              <ContentCopyIcon/>
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Box>
                )}
              </div>
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

export default EncryptorDecryptor;
