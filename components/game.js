import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { AST_ClassExpression } from 'terser';


const TITLE_REGEX = /Game Thread: (.*) @ (.*) \((.*)\)/;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

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

    this.teamOne = collect[1];
    this.teamTwo = collect[2];

    const timeParts = collect[3].split(' ');
    const date = new Date();
    const [hours, minutes] = timeParts[0].split(':');


    date.setHours(hours - 3);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.date = date;

    this._comments = props.gameData.comments.map((c) => {
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
    const { url } = this.props.gameData;
    const { classes } = this.props;
    return (
      <Grid item className={classes.cardContainer}>
        <Card className={classes.card}>
          <CardContent>
            <Link variant="h3" href={url}>
              {this.teamOne}
              {' '}
vs.
              {' '}
              {this.teamTwo}
            </Link>
            <Typography variant="h4">{this.date.toLocaleTimeString()}</Typography>
            {this._comments.map((c, ci) => (
              <ExpansionPanel key={`author-${ci}`}>
                <ExpansionPanelSummary>
                  <Typography className="comment-author">{c.author}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <ul>
                    {c.urls.map((url, i) => <li key={`link-${i}`}><Typography><Link href={url}>{url}</Link></Typography></li>)}
                  </ul>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Game);
