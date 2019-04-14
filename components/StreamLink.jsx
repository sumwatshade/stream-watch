import React from 'react';

import { string } from 'prop-types';
import ListItem from '@material-ui/core/ListItem';

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const StreamLink = ({ url, author }) => (
  <ListItemLink href={url} key={`link-${url}`}>
    {`${url} (u/${author})`}
  </ListItemLink>
);

StreamLink.propTypes = {
  url: string,
  author: string,
};

StreamLink.defaultProps = {
  url: '',
  author: '',
};

export default StreamLink;
