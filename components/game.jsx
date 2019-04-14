import React from 'react';
import * as Sentry from '@sentry/browser';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const TITLE_REGEX = /Game Thread: (.*) (?:@|at|vs|vs\.)+ (.*) \(*(\d+:\d+ \w+ \w+)\)*/;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

function isValidUrl(u) {
  return !['reddit', 'discord'].some(t => u.includes(t));
}

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}


const styles = theme => ({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    minWidth: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  heading: {
    color: theme.palette.primary.main,
    flexGrow: 1,
  },
  secondaryHeading: {
    alignSelf: 'center',
    color: theme.palette.text.secondary,
    flexBasis: '30%',
    flexShrink: 0,
    [theme.breakpoints.down('xs')]: {
      alignSelf: 'flex-start',
    },
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  urlList: {
    width: '100%',
    wordBreak: 'break-all',
  },
  progress: {
    margin: 'auto',
  },
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    const collect = TITLE_REGEX.exec(props.gameData.title);
    const [, teamOne, teamTwo] = collect;

    const timeParts = collect[3].split(' ');
    const date = new Date();
    const [hours, minutes] = timeParts[0].split(':');


    const modifier = timeParts[1] === 'PM' ? 12 : 0;
    date.setHours(hours - modifier);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    this.state = {
      urls: [],
      teamOne,
      teamTwo,
      date,
      loading: true,
    };
  }

  async componentDidMount() {
    const { gameData: { permalink } } = this.props;

    const fetchUrl = `https://www.reddit.com${permalink.substring(0, permalink.length - 1)}.json`;

    const commentsFetch = await fetch(fetchUrl);
    const commentsJson = await commentsFetch.json();

    let urls = [];
    commentsJson[1].data.children.forEach((cd) => {
      const c = cd.data;
      let m;
      do {
        m = URL_REGEX.exec(c.body);
        if (m) {
          urls.push({ author: c.author, url: m[0] });
        }
      } while (m);
    });

    urls = urls.filter((thing, index, self) => index === self.findIndex(t => (
      t.url === thing.url
    )));

    this.setState({
      urls,
      loading: false,
    });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    const { gameData: { url }, classes } = this.props;
    const {
      urls, teamOne, teamTwo, date, error, loading,
    } = this.state;

    const Summary = error ? (
      <Typography className={classes.collapsed}>
        <Typography variant="h5" className={classes.heading}>An Error occured retrieving this game...</Typography>
      </Typography>
    ) : (
      <Typography className={classes.collapsed}>
        <Link variant="h4" className={classes.heading} href={url}>
          <Typography variant="h4">{teamOne}</Typography>
          <Typography variant="h4">{teamTwo}</Typography>
        </Link>
        <Typography variant="h5" className={classes.secondaryHeading}>{date.toLocaleTimeString()}</Typography>
      </Typography>
    );

    const Listing = loading ? (
      <CircularProgress className={classes.progress} />
    ) : (
      <List className={classes.urlList}>
        {urls.filter(uo => isValidUrl(uo.url)).map(uo => (
          <ListItemLink href={uo.url} key={`link-${uo.url}`}>{`${uo.url} (u/${uo.author})`}</ListItemLink>
        ))}
      </List>
    );

    return (
      <Grid item className={classes.container}>
        <ExpansionPanel className={classes.card}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            {Summary}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {Listing}
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </Grid>
    );
  }
}

export default withStyles(styles)(Game);
