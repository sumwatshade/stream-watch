import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';


const TITLE_REGEX = /Game Thread: (.*) @ (.*) \((.*)\)/;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

const styles = {
  cardContainer: {
    minWidth: '85%',
    maxWidth: '85%',
  },
  card: {
    backgroundColor: '#ffffff',
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
};

class Game extends React.Component {
  constructor(props) {
    super(props);

    const collect = TITLE_REGEX.exec(props.gameData.title);

    [, this.teamOne, this.teamTwo] = collect;

    const timeParts = collect[3].split(' ');
    const date = new Date();
    const [hours, minutes] = timeParts[0].split(':');


    date.setHours(hours - 3);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.date = date;

    this.comments = props.gameData.comments.map((c) => {
      const urls = [];
      let m;
      do {
        m = URL_REGEX.exec(c.body);
        if (m) {
          urls.push(m[0]);
        }
      } while (m);
      return {
        html: c.body_html,
        body: c.body,
        author: c.author,
        urls,
      };
    });
  }

  render() {
    const { gameData: { url }, classes } = this.props;
    const header = `${this.teamOne} vs. ${this.teamTwo}`;
    return (
      <Grid item className={classes.cardContainer}>
        <ExpansionPanel className={classes.card}>
          <ExpansionPanelSummary>
            <Link variant="h3" href={url}>
              {header}
            </Link>
            <Typography variant="h4">{this.date.toLocaleTimeString()}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ul>
              {this.comments.map(c => c.urls.map(u => (
                <li key={`link-${u}`}>
                  <Link href={u}>{`${u} (u/${c.author})`}</Link>
                </li>
              )))}
            </ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </Grid>
    );
  }
}

export default withStyles(styles)(Game);
