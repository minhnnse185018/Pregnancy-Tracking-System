import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";

// Sample transactions data
const transactionsData = [
  {
    id: 1,
    date: "2016-11-22",
    description: "Enim nulla leo",
    amount: "$230",
    category: "Uncategorized Income",
    account: "Savings",
    status: "complete",
  },
  {
    id: 2,
    date: "2016-11-17",
    description: "Leo nibh nec",
    amount: "$452",
    category: "Sales",
    account: "Cash on Hand",
    status: "complete",
  },
  {
    id: 3,
    date: "2016-10-03",
    description: "Neque metus id rhoncus",
    amount: "$740",
    category: "Sales",
    account: "Cash on Hand",
    status: "pending",
  },
  {
    id: 4,
    date: "2016-09-18",
    description: "In urna torquent",
    amount: "$1320",
    category: "Income",
    account: "Savings",
    status: "complete",
  },
  {
    id: 5,
    date: "2016-09-05",
    description: "Semper vitae ligula pede",
    amount: "$742",
    category: "Expense",
    account: "Cash Management",
    status: "pending",
  },
  // Add more transactions as needed...
];

const ManagerTransaction = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fff",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Transactions
      </Typography>

      {/* Filter Section */}
      {/* <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
              <MenuItem value="Uncategorized Income">
                Uncategorized Income
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Savings">Savings</MenuItem>
              <MenuItem value="Cash on Hand">Cash on Hand</MenuItem>
              <MenuItem value="Cash Management">Cash Management</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid> */}

      {/* Add Income and Expense Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#4CAF50" }}
        >
          Add Income
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ backgroundColor: "#F44336" }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Transactions Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#f5f5f5" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionsData.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.account}</TableCell>
                <TableCell>
                  {transaction.status === "complete" ? "✔️" : "❌"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
};

export default ManagerTransaction;
