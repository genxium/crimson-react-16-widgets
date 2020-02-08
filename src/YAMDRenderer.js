'use strict';

import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// These modules are exported by CommonJs "module.exports = " syntax.
const md = require('markdown-it')()
  .disable(['image']);

if ('undefined' != typeof (mermaid)) {
  mermaid.initialize({
    startOnLoad: true,
  });
}

class YAMDRenderer extends React.Component {
  constructor(props) {
    this.state = {
      dangerousInnerHTML: "",
      mermaidSubstituteResidualList: [],
    };
  }

  mdRenderAsync(source) {
    return new Promise(function(resolve, reject) {
      resolve(md.render(source));
    });
  }

  imgSubstituteToRenderableAsync(content, previewableImageList) {
    const widgetRef = this;
    const props = widgetRef.props;

    if (!previewableImageList || 0 >= previewableImageList.length) {
      return new Promise(function(resolve, reject) {
        resolve(content);
      });
    }

    const regex = new RegExp('\!\{' + props.imgTag + '\}\%(\\d+)\%', 'g');
    const newContent = content.replace(regex, function(match, param1, offset, wholeString) {
      if (typeof previewableImageList[param1] != 'undefined') {
        const src = previewableImageList[param1].src;
        const replacementTag = "<img style='display: block; width: 100%; object-fit: contain;' src='" + src + "'/>";
        return replacementTag;
      } else {
        return match;
      }
    });

    return new Promise(function(resolve, reject) {
      resolve(newContent);
    });
  }

  videoSubstituteToRenderableAsync(content, previewableVideoList) {
    const widgetRef = this;
    const props = widgetRef.props;

    if (!previewableVideoList || 0 >= previewableVideoList.length) {
      return new Promise(function(resolve, reject) {
        resolve(content);
      });
    }

    const regex = new RegExp('\!\{' + props.videoTag + '\}\%(\d+)\%', 'g');
    const newContent = content.replace(regex, function(match, param1, offset, wholeString) {
      if (typeof previewableVideoList[param1] != 'undefined') {
        const src = previewableVideoList[param1].src;
        const replacementTag = ["<video width='100%' controls>",
          "<source src='" + src + "'>",
          "</video>"].join('\n');
        return replacementTag;
      } else {
        return match;
      }
    });

    return new Promise(function(resolve, reject) {
      resolve(newContent);
    });
  }

  ktxSubstituteToRenderableAsync(content, disabled) {
    const widgetRef = this;
    const props = widgetRef.props;

    if (true == disabled) return new Promise(function(resolve, reject) {
        resolve(content);
      });
    const regex = new RegExp('\!\{' + props.ktxTag + '\}\%([^%]+)\%', 'g');
    const newContent = content.replace(regex, function(match, param1, offset, wholeString) {
      try {
        const toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
        const replacementTag = katex.renderToString(toRenderParam);
        return replacementTag;
      } catch (err) {
        return param1;
      }
    });

    return new Promise(function(resolve, reject) {
      resolve(newContent);
    });
  }

  alnctrContentSubmittableToRenderableAsync(content) {
    const widgetRef = this;
    const props = widgetRef.props;
    if (undefined === props.alignCenterTag || null === props.alignCenterTag) {
      return new Promise(function(resolve, reject) {
        resolve(content);
      });
    }

    const regex = new RegExp('\!\{' + props.alignCenterTag + '\}\%([^%]+)\%', 'g');
    const newContent = content.replace(regex, function(match, param1, offset, wholeString) {
      try {
        const toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
        let strongRegex = /<strong>([\s\S]+)<\/strong>/g;
        let tmp = toRenderParam.replace(strongRegex, "<span style=\'font-weight: bold; font-size: 24px;\'>$1</span>");
        const replacementTag = "<div style=\'width: 100%; text-align: center;\'>" + tmp + "</div>";
        return replacementTag;
      } catch (err) {
        return param1;
      }
    });
    return new Promise(function(resolve, reject) {
      resolve(newContent);
    });
  }

  generateRandomMermaidId(idxOfRegExpTraversal) {
    return "mermaid-" + idxOfRegExpTraversal;
  }

  mermaidSubstituteToRenderableAsync(content, disabled) {
    const widgetRef = this;
    const props = widgetRef.props;

    if (true == disabled) return new Promise(function(resolve, reject) {
        resolve(content);
      });

    let newMermaidSubstituteResidualList = [];
    let idxOfRegExpTraversal = 0;

    const regex = new RegExp('\!\{' + props.mermaidTag + '\}\%([^%]+)\%', 'g');
    const newContent = content.replace(regex, function(match, param1, offset, wholeString) {
      try {
        const assignedId = widgetRef.generateRandomMermaidId(idxOfRegExpTraversal);
        const toSave = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
        newMermaidSubstituteResidualList.push({
          id: assignedId,
          graph: toSave,
        });
        const replacementTag = "<div id='" + assignedId + "' class='mermaid'>" + param1 + "</div>";
        return replacementTag;
      } catch (err) {
        return param1;
      } finally {
        ++idxOfRegExpTraversal;
      }
    });

    return new Promise(function(resolve, reject) {
      resolve({
        content: newContent,
        substitueResidualList: newMermaidSubstituteResidualList,
      });
    });
  }

  renderWithWholePipelineAsync(
    source,
    previewableImageList,
    previewableVideoList,
    disableTeX,
    disableMermaid,
  ) {
    const widgetRef = this;
    const props = widgetRef.props;
    return widgetRef.mdRenderAsync(source)
      .then(function(newSource) {
        return widgetRef.imgSubstituteToRenderableAsync(newSource, previewableImageList);
      })
      .then(function(newSource) {
        return widgetRef.videoSubstituteToRenderableAsync(newSource, previewableVideoList);
      })
      .then(function(newSource) {
        return widgetRef.ktxSubstituteToRenderableAsync(newSource, disableTeX);
      })
      .then(function(newSource) {
        return widgetRef.alnctrContentSubmittableToRenderableAsync(newSource);
      })
      .then(function(newSource) {
        return widgetRef.mermaidSubstituteToRenderableAsync(newSource, disableMermaid);
      })
      .then(function(rendered) {
        return new Promise(function(resolve, reject) {
          widgetRef.setState({
            mermaidSubstituteResidualList: rendered.substitueResidualList,
            dangerousInnerHTML: rendered.content,
          }, function() {
            resolve(true);
          });
        });
      });
  }

  componentDidMount() {
    const widgetRef = this;
    const props = widgetRef.props;
    const source = props.source;
    const previewableImageList = props.previewableImageList;
    const previewableVideoList = props.previewableVideoList;
    const disableTeX = props.disableTeX;
    const disableMermaid = props.disableMermaid;
    widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
  }

  componentWillReceiveProps(nextProps) {
    const widgetRef = this;
    const source = nextProps.source;
    const previewableImageList = nextProps.previewableImageList;
    const previewableVideoList = nextProps.previewableVideoList;
    const disableTeX = nextProps.disableTeX;
    const disableMermaid = nextProps.disableMermaid;
    widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;
    const style = props.style;

    return React.createElement('div', {
      style: style,
      dangerouslySetInnerHTML: {
        __html: widgetRef.state.dangerousInnerHTML,
      }
    }, null);
  }

  componentDidUpdate() {
    const widgetRef = this;
    const props = widgetRef.props;
    const disableMermaid = props.disableMermaid;
    if (true == disableMermaid) return;

    if ('undefined' == typeof (mermaid)) return;
    mermaid.init(props.mermaidOptions, ".mermaid");
  }
}

export default YAMDRenderer;
