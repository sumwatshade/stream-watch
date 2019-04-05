import React from 'react';
// import fetch from 'isomorphic-unfetch';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Nav from '../components/nav';
import Head from '../components/head';
import Game from '../components/game';

import mockRes from '../test/sample';
import mockPosts from '../test/posts';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background,
  },
});
const Index = (props) => {
  const { classes: { root }, streamData } = props;
  return (
    <React.Fragment>
      <Head title="NBA Games" />
      <Nav />
      <Grid container direction="column" justify="center" alignItems="center" spacing={8} className={root}>
        <Grid item>
          <Typography variant="h1">NBA Games</Typography>
        </Grid>
        {streamData.map(o => (o.title.indexOf('Game Thread') < 0 ? null : (
          <Game key={`game-${o.title}`} gameData={o} />
        )))}
      </Grid>
    </React.Fragment>

  );
};

Index.getInitialProps = async function getInit() {
  // const res = await fetch('https://www.reddit.com/r/nbastreams.json')
  const res = mockRes;
  const jsonResponse = await res.json();

  const posts = jsonResponse.data.children.map(c => c.data);

  const postsArray = [];
  posts.forEach(async (p, index) => {
    const r = Object.assign({}, p);
    // const url = `${p.url.substring(0, p.url.length - 1)}.json`;
    // const commentsRes = await fetch(url);
    // const jsonComments = await commentsRes.json();
    const jsonComments = mockPosts[index];
    const comments = jsonComments[1].data.children.map(c => c.data);

    r.comments = comments;
    postsArray.push(r);
  });


  // For each game, find a comment made by the bot that posts stream data
  return {
    streamData: postsArray,
    raw: jsonResponse,
  };
};

export default withStyles(styles)(Index);
