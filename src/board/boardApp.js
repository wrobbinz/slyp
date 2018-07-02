import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { reverse, remove, union } from 'lodash';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Grid, Header, Icon } from 'semantic-ui-react';
import BoardMenu from './boardMenu';
import api from '../api';


class BoardApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      userTags: [],
    };
  }

  async componentWillMount() {
    const notesResponse = await axios.get(api.notes, api.config());
    const notes = reverse(notesResponse.data);
    if (notes.length > 0) {
      const note = notes[0];
      const editorState = EditorState.createWithContent(convertFromRaw(note.content));
      const userTags = this.props.user.tags || [];
      this.setState({
        notes,
        note,
        editorState,
        userTags,
      });
    }
  }

  selectNote = (id) => {
    const note = this.state.notes.find(n => n.id === id);
    console.log('Selected:', note);
    const editorState = EditorState.createWithContent(convertFromRaw(note.content));
    this.setState({ note, editorState });
  }

  createNote = (title = 'Untitled Note', content = convertToRaw(ContentState.createFromText(''))) => {
    const payload = { title, content, tags: [] };
    axios.post(api.notes, payload, api.config())
      .then((res) => {
        const { notes } = this.state;
        notes.unshift(res.data);
        const note = res.data;
        const editorState = EditorState.createWithContent(convertFromRaw(note.content));
        this.setState({ notes, note, editorState });
      })
      .catch((err) => {
        throw err;
      });
  }

  saveNote = async (id) => {
    try {
      const { title, content } = this.state.note;
      const payload = { title, content };
      return axios.put(`${api.notes}${id}`, payload, api.config());
    } catch (error) {
      throw error;
    }
  }

  copyNote = (id) => {
    const note = this.state.notes.find(n => n.id === id);
    const { content } = note;
    let { title } = note;
    title = `${title} copy`;
    this.createNote(title, content);
  }

  deleteNote = (id) => {
    axios.delete(`${api.notes}${id}`, api.config())
      .then(() => {
        const { notes } = this.state;
        remove(notes, note => note.id === id);
        const note = notes[0] || null;
        this.setState({ notes, note });
      })
      .catch((err) => {
        throw err;
      });
  }

  updateTitle = (event) => {
    this.setState({ isSaved: false });
    const { note } = this.state;
    note.title = event.target.value;
    this.setState({ note });
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(async () => {
      await this.saveNote(note.id);
      this.setState({ isSaved: true });
    }, 1000);
  }

  updateContent = (editorState) => {
    const contentState = editorState.getCurrentContent();
    if (contentState !== this.state.editorState.getCurrentContent()) {
      this.setState({ isSaved: false });
      const { note } = this.state;
      const rawContent = convertToRaw(contentState);
      note.content = rawContent;
      this.setState({ note, editorState });

      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      this.typingTimeout = setTimeout(async () => {
        await this.saveNote(note.id);
        this.setState({ isSaved: true });
      }, 1000);
    } else {
      this.setState({ editorState });
    }
  }

  updateOrder = (notes) => {
    this.setState({ notes });
  }

  addUserTag = async (value) => {
    try {
      const payload = { tags: [{ text: value, value, key: value }, ...this.state.userTags] };
      const url = `${api.users}${this.props.user.id}`;
      const updatedUser = await axios.put(url, payload, api.config());
      this.setState({ userTags: updatedUser.data.tags });
    } catch (err) {
      throw err;
    }
  }
  updateNoteTags = async (value) => {
    try {
      const { note } = this.state;
      const tags = value.map(tag => (tag.value ? tag : { text: tag, value: tag, key: tag }));
      const payload = { tags };
      const url = `${api.notes}${this.state.note.id}`;
      const updatedNote = await axios.put(url, payload, api.config());
      note.tags = updatedNote.data.tags;
      this.setState({ note });
    } catch (err) {
      throw err;
    }
  }

  async removeStaleTags() {
    const { notes, userTags } = this.state;
    const allNoteTags = union(notes.reduce((tags, note) => tags.concat(note.tags), []));
    const usedTags = userTags.filter(tag => allNoteTags.includes(tag));
    if (usedTags !== this.state.userTags) {
      try {
        const payload = { tags: usedTags };
        const url = `${api.users}${this.props.user.id}`;
        const updatedUser = await axios.put(url, payload, api.config());
        this.setState({ userTags: updatedUser.data.tags });
      } catch (err) {
        throw err;
      }
    }
  }

  updateRating = async (rating) => {
    const isFavorite = rating === 1;
    const payload = { is_favorite: isFavorite };
    const url = `${api.notes}${this.state.note.id}`;
    await axios.put(url, payload, api.config());
    const { note } = this.state;
    note.is_favorite = isFavorite;
    this.setState({ note });
  }

  render() {
    return (
      <div className="full-height">
        <BoardMenu
          notes={this.state.notes}
          note={this.state.note}
          selectNote={this.selectNote}
          createNote={this.createNote}
          copyNote={this.copyNote}
          deleteNote={this.deleteNote}
          updateOrder={this.updateOrder}
          userTags={this.state.userTags}
          addUserTag={this.addUserTag}
        />
      </div>
    );
  }
}

BoardApp.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

BoardApp.defaultProps = {
  user: null,
};

export default BoardApp;