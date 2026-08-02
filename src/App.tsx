import {useState} from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PasswordGenerator from "./components/PasswordGenerator";
import EncryptorDecryptor from "./components/EncryptorDecryptor";
import {hasSecretKeyVerifier, saveSecretKeyVerifier, verifySecretKey} from "./lib/SecretKeyVerifier";
import {SecretKeyDialogMode} from "./components/SecretKeyDialogMode";
import SetSecretKeyDialog from "./components/SetSecretKeyDialog";
import ThemeSwitch from "./components/ThemeSwitch";
import UnlockSecretKeyDialog from "./components/UnlockSecretKeyDialog";

function App() {
  const [key, setKey] = useState<string | null>(null);
  const [hasSavedVerifier, setHasSavedVerifier] = useState(() => hasSecretKeyVerifier());
  const [dialogMode, setDialogMode] = useState<SecretKeyDialogMode>(
    hasSavedVerifier ? SecretKeyDialogMode.Unlock : SecretKeyDialogMode.Setup
  );
  const [dialogOpen, setDialogOpen] = useState(true);
  const [dialogMounted, setDialogMounted] = useState(true);

  const openDialog = () => {
    setDialogMode(hasSavedVerifier && key === null ? SecretKeyDialogMode.Unlock : SecretKeyDialogMode.Setup);
    setDialogMounted(true);
    setDialogOpen(true);
  };

  const handleSetKey = async (newKey: string) => {
    await saveSecretKeyVerifier(newKey);
    setHasSavedVerifier(true);
    setKey(newKey);
  };

  const handleUnlockKey = async (newKey: string) => {
    if (!(await verifySecretKey(newKey))) {
      return "Secret Key is incorrect";
    }
    setKey(newKey);
    return null;
  };

  return (
    <Container maxWidth="md">
      <div className="flex-column gap-4 py-6">
        <div className="flex-between gap-4">
          <Typography variant="h4" component="h1" sx={{fontWeight: 700}}>
            Key Forge
          </Typography>
          <div className="flex-start-center gap-2">
            <Button variant="outlined" onClick={openDialog}>
              Set Secret Key
            </Button>
            <ThemeSwitch/>
          </div>
        </div>
        {dialogMounted && dialogMode === SecretKeyDialogMode.Setup && (
          <SetSecretKeyDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onExited={() => setDialogMounted(false)}
            keyValue={key}
            setKeyValue={handleSetKey}
          />
        )}
        {dialogMounted && dialogMode === SecretKeyDialogMode.Unlock && (
          <UnlockSecretKeyDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onExited={() => setDialogMounted(false)}
            setKeyValue={handleUnlockKey}
            reset={() => setDialogMode(SecretKeyDialogMode.Setup)}
          />
        )}
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <PasswordGenerator keyValue={key}/>
          <EncryptorDecryptor keyValue={key}/>
        </div>
      </div>
    </Container>
  );
}

export default App;
