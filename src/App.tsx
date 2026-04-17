import {useState} from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PasswordGenerator from "./components/PasswordGenerator";
import EncryptorDecryptor from "./components/EncryptorDecryptor";
import SecretKeyDialog from "./components/SecretKeyDialog";
import ThemeSwitch from "./components/ThemeSwitch";

const SecretKeyStorage = "secretKey";

function App() {
  const [key, setKey] = useState(() => {
    const savedKey = localStorage.getItem(SecretKeyStorage);
    return savedKey ? Number(savedKey) : 0;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMounted, setDialogMounted] = useState(false);

  const openDialog = () => {
    setDialogMounted(true);
    setDialogOpen(true);
  };

  const handleSetKey = (newKey: number, remember: boolean) => {
    setKey(Number(newKey));
    if (remember && newKey) {
      localStorage.setItem(SecretKeyStorage, newKey.toString());
    } else {
      localStorage.removeItem(SecretKeyStorage);
    }
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
        {dialogMounted && (
          <SecretKeyDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onExited={() => setDialogMounted(false)}
            keyValue={key}
            setKeyValue={handleSetKey}
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
