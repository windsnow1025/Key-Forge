import {type MouseEvent, useState} from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import KeyIcon from "@mui/icons-material/Key";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function SecretKeyDialog({open, onClose, onExited, keyValue, setKeyValue}: {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
  keyValue: number;
  setKeyValue: (newKey: number, remember: boolean) => void;
}) {
  const [inputValue, setInputValue] = useState<number>(keyValue);
  const [rememberKey, setRememberKey] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setKeyValue(inputValue, rememberKey);
    onClose();
  };

  const handleClickShowKey = () => setShowKey(!showKey);

  const preventDefault = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onClose={onClose} slotProps={{transition: {onExited}}}>
      <DialogTitle>Set Secret Key</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-secret-key">Secret Key</InputLabel>
          <OutlinedInput
            id="outlined-adornment-secret-key"
            type={showKey ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberKey}
              onChange={(e) => setRememberKey(e.target.checked)}
              color="primary"
            />
          }
          label="Remember this key"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SecretKeyDialog;
