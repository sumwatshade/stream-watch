import fetch from 'isomorphic-unfetch';
import Game from '../components/game';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import mockRes from "../test/sample";
import mockPosts from "../test/posts";

const Index = (props) => (
  <Grid container direction="column" justify="center" alignItems="center" spacing="20px">
    <Typography variant="h1">NBA Games</Typography>
        {props.streamData.map((o, i) => {
      return o.title.indexOf("Game Thread") < 0 ? null : (
        <Game key={`game-${i}`} gameData={o} />
    )})}
  </Grid>
)

Index.getInitialProps = async function() {
  //const res = await fetch('https://www.reddit.com/r/nbastreams.json')
  const res = mockRes;
  const jsonResponse = await res.json()

  const posts = jsonResponse.data.children.map(c => c.data);

  let index = 0;
  for(let p of posts) {
    const url = p.url.substring(0, p.url.length-1) + ".json";
    const commentsRes = await fetch(url);
    // const jsonComments = await commentsRes.json();
    const jsonComments = mockPosts[index]
    const comments = jsonComments[1].data.children.map(c => c.data);

    p.comments = comments;
    index++;
  }

  // For each game, find a comment made by the bot that posts stream data
  return {
    streamData: posts,
    raw: jsonResponse,
  }
}

export default Index