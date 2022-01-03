import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary2 } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector } from "../../app/hooks";

import { selectTransactions } from "./transactionsSlice";
import { TransactionStatus, TransactionType } from "./types/transactionTypes";

import {
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableBody,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { format } from "date-fns";

export const TransactionPayments = () => {
  const {
    paymentsWithCount: { payments },
    selectedHeader,
  } = useAppSelector(selectTransactions);

  return (
    <>
      {selectedHeader?.status !== TransactionStatus.Draft &&
        (selectedHeader?.type === TransactionType.Sale ||
          selectedHeader?.type === TransactionType.Purchase) && (
          <Accordion sx={{ my: 1 }} expanded={true}>
            <StyledAccordionSummary2
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" color="primary">
                Payments
              </Typography>
            </StyledAccordionSummary2>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No</StyledTableCell>
                      <StyledTableCell>Payment Date</StyledTableCell>
                      <StyledTableCell>Method</StyledTableCell>
                      <StyledTableCell align="right">Amount</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {payments &&
                      payments.map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell
                            scope="row"
                            sx={{ padding: "0px 16px" }}
                          >
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {format(
                              new Date((row.paymentDate as Date).toString()),
                              "MMM-dd-yyyy"
                            )}
                            (
                            {getAmharicCalendarFormatted(
                              row.paymentDate as Date,
                              "-"
                            )}
                            )
                          </StyledTableCell>
                          <StyledTableCell
                            scope="row"
                            sx={{ padding: "0px 16px" }}
                          >
                            {row.method}
                          </StyledTableCell>
                          <StyledTableCell
                            scope="row"
                            sx={{ padding: "0px 16px" }}
                            align="right"
                          >
                            {row.amount?.toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.status}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
    </>
  );
};
