import { AppBar, Toolbar, Typography } from '@mui/material';

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Form Builder
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
