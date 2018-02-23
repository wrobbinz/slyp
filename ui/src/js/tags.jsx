import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'


class NoteOptions extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
    }
  }

  handleAddition = (e, { value }) => {
    this.props.addUserTag(value)
  }

  handleChange = (e, { value }) => {
    this.props.updateNoteTags(value)
  }

  render() {
    return (
      <Dropdown
        options={this.props.userTags}
        placeholder={this.props.placeholder}
        search
        selection
        multiple
        allowAdditions
        value={this.props.note.tags.map(tag => tag.value)}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    )
  }
}

NoteOptions.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  addUserTag: PropTypes.func,
  updateNoteTags: PropTypes.func,
  placeholder: PropTypes.string,
}

NoteOptions.defaultProps = {
  note: null,
  userTags: null,
  addUserTag: null,
  updateNoteTags: null,
  placeholder: null,
}

export default NoteOptions
