import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function BasicTextFields() {
    return (
        <Box sx={{}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username / Email "
              name="email"
              autoComplete="email"
              autoFocus
            />
        </Box>
    );
}
