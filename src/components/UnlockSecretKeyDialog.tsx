import {type MouseEvent, useState} from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import KeyIcon from "@mui/icons-material/Key";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function UnlockSecretKeyDialog({open, onClose, onExited, setKeyValue, reset}: {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
  setKeyValue: (newKey: string) => Promise<string | null>;
  reset: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleUnlock = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setErrorMessage("Secret Key is required");
      return;
    }
    const error = await setKeyValue(trimmedValue);
    if (error) {
      setErrorMessage(error);
      return;
    }
    onClose();
  };

  const handleClickShowKey = () => setShowKey(!showKey);

  const preventDefault = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} slotProps={{transition: {onExited}}}>
      <DialogTitle>Unlock Secret Key</DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{mt: 1, mb: 1}}>
            {errorMessage}
          </Alert>
        )}
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-secret-key">Secret Key</InputLabel>
          <OutlinedInput
            id="outlined-adornment-secret-key"
            type={showKey ? "text" : "password"}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setErrorMessage("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUnlock();
              }
            }}
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon/>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showKey ? "hide the secret key" : "display the secret key"}
                  onClick={handleClickShowKey}
                  onMouseDown={preventDefault}
                  onMouseUp={preventDefault}
                  edge="end"
                >
                  {showKey ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                </IconButton>
              </InputAdornment>
            }
            label="Secret Key"
            autoFocus
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={reset}>Reset</Button>
        <Button onClick={handleUnlock} variant="contained">Unlock</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnlockSecretKeyDialog;
