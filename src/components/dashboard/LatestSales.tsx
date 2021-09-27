import { v4 as uuid } from "uuid";
import { subHours } from "date-fns";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const Sales = [
  {
    id: uuid(),
    name: "Dropbox",
    imageUrl: "/static/images/Sales/Sale_1.png",
    updatedAt: subHours(new Date(), 2),
  },
  {
    id: uuid(),
    name: "Medium Corporation",
    imageUrl: "/static/images/Sales/Sale_2.png",
    updatedAt: subHours(new Date(), 2),
  },
  {
    id: uuid(),
    name: "Slack",
    imageUrl: "/static/images/Sales/Sale_3.png",
    updatedAt: subHours(new Date(), 2),
  },
  {
    id: uuid(),
    name: "Lyft",
    imageUrl: "/static/images/Sales/Sale_4.png",
    updatedAt: subHours(new Date(), 2),
  },
  {
    id: uuid(),
    name: "GitHub",
    imageUrl: "/static/images/Sales/Sale_5.png",
    updatedAt: subHours(new Date(), 2),
  },
];

interface PropTypes {
  height?: string;
}
const LatestSales = (props: PropTypes) => (
  <Card {...props}>
    <CardHeader subtitle={`${Sales.length} in total`} title="Latest Sales" />
    <Divider />
    <List>
      {Sales.map((Sale, i) => (
        <ListItem divider={i < Sales.length - 1} key={Sale.id}>
          <ListItemAvatar>
            <img
              alt={Sale.name}
              src={Sale.imageUrl}
              style={{
                height: 48,
                width: 48,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={Sale.name}
            secondary={`Updated ${Sale.updatedAt}`}
          />
          <IconButton edge="end" size="small">
            <MoreVertIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
    <Divider />
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        p: 2,
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
);

export default LatestSales;
