Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _helpers = require('./helpers');

var VALID_SEVERITY = new Set(['error', 'warning', 'info']);

function validateUI(ui) {
  var messages = [];

  if (ui && typeof ui === 'object') {
    if (typeof ui.name !== 'string') {
      messages.push('UI.name must be a string');
    }
    if (typeof ui.didBeginLinting !== 'function') {
      messages.push('UI.didBeginLinting must be a function');
    }
    if (typeof ui.didFinishLinting !== 'function') {
      messages.push('UI.didFinishLinting must be a function');
    }
    if (typeof ui.render !== 'function') {
      messages.push('UI.render must be a function');
    }
    if (typeof ui.dispose !== 'function') {
      messages.push('UI.dispose must be a function');
    }
  } else {
    messages.push('UI must be an object');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid UI received', 'These issues were encountered while registering the UI named \'' + (ui && ui.name ? ui.name : 'Unknown') + '\'', messages);
    return false;
  }

  return true;
}

function validateLinter(linter, version) {
  var messages = [];

  if (linter && typeof linter === 'object') {
    if (typeof linter.name !== 'string') {
      messages.push('Linter.name must be a string');
    }
    if (typeof linter.scope !== 'string' || linter.scope !== 'file' && linter.scope !== 'project') {
      messages.push("Linter.scope must be either 'file' or 'project'");
    }
    if (version === 1 && typeof linter.lintOnFly !== 'boolean') {
      messages.push('Linter.lintOnFly must be a boolean');
    } else if (version === 2 && typeof linter.lintsOnChange !== 'boolean') {
      messages.push('Linter.lintsOnChange must be a boolean');
    }
    if (!Array.isArray(linter.grammarScopes)) {
      messages.push('Linter.grammarScopes must be an Array');
    }
    if (typeof linter.lint !== 'function') {
      messages.push('Linter.lint must be a function');
    }
  } else {
    messages.push('Linter must be an object');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Linter received', 'These issues were encountered while registering a Linter named \'' + (linter && linter.name ? linter.name : 'Unknown') + '\'', messages);
    return false;
  }

  return true;
}

function validateIndie(indie) {
  var messages = [];

  if (indie && typeof indie === 'object') {
    if (typeof indie.name !== 'string') {
      messages.push('Indie.name must be a string');
    }
  } else {
    messages.push('Indie must be an object');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Indie received', 'These issues were encountered while registering an Indie Linter named \'' + (indie && indie.name ? indie.name : 'Unknown') + '\'', messages);
    return false;
  }

  return true;
}

function validateMessages(linterName, entries) {
  var messages = [];

  if (Array.isArray(entries)) {
    var invalidURL = false;
    var invalidIcon = false;
    var invalidExcerpt = false;
    var invalidLocation = false;
    var invalidSeverity = false;
    var invalidSolution = false;
    var invalidReference = false;
    var invalidDescription = false;

    for (var i = 0, _length = entries.length; i < _length; ++i) {
      var message = entries[i];
      var reference = message.reference;
      if (!invalidIcon && message.icon && typeof message.icon !== 'string') {
        invalidIcon = true;
        messages.push('Message.icon must be a string');
      }
      if (!invalidLocation && (!message.location || typeof message.location !== 'object' || typeof message.location.file !== 'string' || typeof message.location.position !== 'object' || !message.location.position)) {
        invalidLocation = true;
        messages.push('Message.location must be valid');
      } else if (!invalidLocation) {
        var range = _atom.Range.fromObject(message.location.position);
        if (Number.isNaN(range.start.row) || Number.isNaN(range.start.column) || Number.isNaN(range.end.row) || Number.isNaN(range.end.column)) {
          invalidLocation = true;
          messages.push('Message.location.position should not contain NaN coordinates');
        }
      }
      if (!invalidSolution && message.solutions && !Array.isArray(message.solutions)) {
        invalidSolution = true;
        messages.push('Message.solutions must be valid');
      }
      if (!invalidReference && reference && (typeof reference !== 'object' || typeof reference.file !== 'string' || typeof reference.position !== 'object' || !reference.position)) {
        invalidReference = true;
        messages.push('Message.reference must be valid');
      } else if (!invalidReference && reference) {
        var position = _atom.Point.fromObject(reference.position);
        if (Number.isNaN(position.row) || Number.isNaN(position.column)) {
          invalidReference = true;
          messages.push('Message.reference.position should not contain NaN coordinates');
        }
      }
      if (!invalidExcerpt && typeof message.excerpt !== 'string') {
        invalidExcerpt = true;
        messages.push('Message.excerpt must be a string');
      }
      if (!invalidSeverity && !VALID_SEVERITY.has(message.severity)) {
        invalidSeverity = true;
        messages.push("Message.severity must be 'error', 'warning' or 'info'");
      }
      if (!invalidURL && message.url && typeof message.url !== 'string') {
        invalidURL = true;
        messages.push('Message.url must a string');
      }
      if (!invalidDescription && message.description && typeof message.description !== 'function' && typeof message.description !== 'string') {
        invalidDescription = true;
        messages.push('Message.description must be a function or string');
      }
    }
  } else {
    messages.push('Linter Result must be an Array');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Linter Result received', 'These issues were encountered while processing messages from a linter named \'' + linterName + '\'', messages);
    return false;
  }

  return true;
}

function validateMessagesLegacy(linterName, entries) {
  var messages = [];

  if (Array.isArray(entries)) {
    var invalidFix = false;
    var invalidType = false;
    var invalidClass = false;
    var invalidRange = false;
    var invalidTrace = false;
    var invalidContent = false;
    var invalidFilePath = false;
    var invalidSeverity = false;

    for (var i = 0, _length2 = entries.length; i < _length2; ++i) {
      var message = entries[i];
      if (!invalidType && typeof message.type !== 'string') {
        invalidType = true;
        messages.push('Message.type must be a string');
      }
      if (!invalidContent && (typeof message.text !== 'string' && typeof message.html !== 'string' && !(message.html instanceof HTMLElement) || !message.text && !message.html)) {
        invalidContent = true;
        messages.push('Message.text or Message.html must have a valid value');
      }
      if (!invalidFilePath && message.filePath && typeof message.filePath !== 'string') {
        invalidFilePath = true;
        messages.push('Message.filePath must be a string');
      }
      if (!invalidRange && message.range && typeof message.range !== 'object') {
        invalidRange = true;
        messages.push('Message.range must be an object');
      } else if (!invalidRange && message.range) {
        var range = _atom.Range.fromObject(message.range);
        if (Number.isNaN(range.start.row) || Number.isNaN(range.start.column) || Number.isNaN(range.end.row) || Number.isNaN(range.end.column)) {
          invalidRange = true;
          messages.push('Message.range should not contain NaN coordinates');
        }
      }
      if (!invalidClass && message['class'] && typeof message['class'] !== 'string') {
        invalidClass = true;
        messages.push('Message.class must be a string');
      }
      if (!invalidSeverity && message.severity && !VALID_SEVERITY.has(message.severity)) {
        invalidSeverity = true;
        messages.push("Message.severity must be 'error', 'warning' or 'info'");
      }
      if (!invalidTrace && message.trace && !Array.isArray(message.trace)) {
        invalidTrace = true;
        messages.push('Message.trace must be an Array');
      }
      if (!invalidFix && message.fix && (typeof message.fix.range !== 'object' || typeof message.fix.newText !== 'string' || message.fix.oldText && typeof message.fix.oldText !== 'string')) {
        invalidFix = true;
        messages.push('Message.fix must be valid');
      }
    }
  } else {
    messages.push('Linter Result must be an Array');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Linter Result received', 'These issues were encountered while processing messages from a linter named \'' + linterName + '\'', messages);
    return false;
  }

  return true;
}

exports.ui = validateUI;
exports.linter = validateLinter;
exports.indie = validateIndie;
exports.messages = validateMessages;
exports.messagesLegacy = validateMessagesLegacy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuYW5tYXkzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFNkIsTUFBTTs7dUJBQ1QsV0FBVzs7QUFHckMsSUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7O0FBRTVELFNBQVMsVUFBVSxDQUFDLEVBQU0sRUFBVztBQUNuQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7O0FBRW5CLE1BQUksRUFBRSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTtBQUNoQyxRQUFJLE9BQU8sRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDL0IsY0FBUSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0tBQzFDO0FBQ0QsUUFBSSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEtBQUssVUFBVSxFQUFFO0FBQzVDLGNBQVEsQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtLQUN2RDtBQUNELFFBQUksT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEtBQUssVUFBVSxFQUFFO0FBQzdDLGNBQVEsQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtLQUN4RDtBQUNELFFBQUksT0FBTyxFQUFFLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUNuQyxjQUFRLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUE7S0FDOUM7QUFDRCxRQUFJLE9BQU8sRUFBRSxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDcEMsY0FBUSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0tBQy9DO0dBQ0YsTUFBTTtBQUNMLFlBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtHQUN0Qzs7QUFFRCxNQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDbkIsNEJB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LFVBQVUsU0FBSyxRQUFRLENBQUMsQ0FBQTtBQUNwSixXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELFNBQU8sSUFBSSxDQUFBO0NBQ1o7O1FBR2UsRUFBRSxHQUFoQixVQUFVO1FBQ1EsTUFBTSxHQUF4QixjQUFjO1FBQ0csS0FBSyxHQUF0QixhQUFhO1FBQ08sUUFBUSxHQUE1QixnQkFBZ0I7UUFDVSxjQUFjLEdBQXhDLHNCQUFzQiIsImZpbGUiOiIvaG9tZS9hbmFubWF5My8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZhbGlkYXRlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgUmFuZ2UsIFBvaW50IH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHNob3dFcnJvciB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgVUksIExpbnRlciwgTWVzc2FnZSwgTWVzc2FnZUxlZ2FjeSwgSW5kaWUgfSBmcm9tICcuLi90eXBlcydcblxuY29uc3QgVkFMSURfU0VWRVJJVFkgPSBuZXcgU2V0KFsnZXJyb3InLCAnd2FybmluZycsICdpbmZvJ10pXG5cbmZ1bmN0aW9uIHZhbGlkYXRlVUkodWk6IFVJKTogYm9vbGVhbiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gW11cblxuICBpZiAodWkgJiYgdHlwZW9mIHVpID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh0eXBlb2YgdWkubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goJ1VJLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgdWkuZGlkQmVnaW5MaW50aW5nICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5kaWRCZWdpbkxpbnRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB1aS5kaWRGaW5pc2hMaW50aW5nICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5kaWRGaW5pc2hMaW50aW5nIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgdWkucmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5yZW5kZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB1aS5kaXNwb3NlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5kaXNwb3NlIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2VzLnB1c2goJ1VJIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgfVxuXG4gIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICBzaG93RXJyb3IoJ0ludmFsaWQgVUkgcmVjZWl2ZWQnLCBgVGhlc2UgaXNzdWVzIHdlcmUgZW5jb3VudGVyZWQgd2hpbGUgcmVnaXN0ZXJpbmcgdGhlIFVJIG5hbWVkICcke3VpICYmIHVpLm5hbWUgPyB1aS5uYW1lIDogJ1Vua25vd24nfSdgLCBtZXNzYWdlcylcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGludGVyKGxpbnRlcjogTGludGVyLCB2ZXJzaW9uOiAxIHwgMik6IGJvb2xlYW4ge1xuICBjb25zdCBtZXNzYWdlcyA9IFtdXG5cbiAgaWYgKGxpbnRlciAmJiB0eXBlb2YgbGludGVyID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh0eXBlb2YgbGludGVyLm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdMaW50ZXIubmFtZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaW50ZXIuc2NvcGUgIT09ICdzdHJpbmcnIHx8IChsaW50ZXIuc2NvcGUgIT09ICdmaWxlJyAmJiBsaW50ZXIuc2NvcGUgIT09ICdwcm9qZWN0JykpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goXCJMaW50ZXIuc2NvcGUgbXVzdCBiZSBlaXRoZXIgJ2ZpbGUnIG9yICdwcm9qZWN0J1wiKVxuICAgIH1cbiAgICBpZiAodmVyc2lvbiA9PT0gMSAmJiB0eXBlb2YgbGludGVyLmxpbnRPbkZseSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdMaW50ZXIubGludE9uRmx5IG11c3QgYmUgYSBib29sZWFuJylcbiAgICB9IGVsc2UgaWYgKHZlcnNpb24gPT09IDIgJiYgdHlwZW9mIGxpbnRlci5saW50c09uQ2hhbmdlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goJ0xpbnRlci5saW50c09uQ2hhbmdlIG11c3QgYmUgYSBib29sZWFuJylcbiAgICB9XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGxpbnRlci5ncmFtbWFyU2NvcGVzKSkge1xuICAgICAgbWVzc2FnZXMucHVzaCgnTGludGVyLmdyYW1tYXJTY29wZXMgbXVzdCBiZSBhbiBBcnJheScpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGludGVyLmxpbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goJ0xpbnRlci5saW50IG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2VzLnB1c2goJ0xpbnRlciBtdXN0IGJlIGFuIG9iamVjdCcpXG4gIH1cblxuICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgc2hvd0Vycm9yKCdJbnZhbGlkIExpbnRlciByZWNlaXZlZCcsIGBUaGVzZSBpc3N1ZXMgd2VyZSBlbmNvdW50ZXJlZCB3aGlsZSByZWdpc3RlcmluZyBhIExpbnRlciBuYW1lZCAnJHtsaW50ZXIgJiYgbGludGVyLm5hbWUgPyBsaW50ZXIubmFtZSA6ICdVbmtub3duJ30nYCwgbWVzc2FnZXMpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUluZGllKGluZGllOiBJbmRpZSk6IGJvb2xlYW4ge1xuICBjb25zdCBtZXNzYWdlcyA9IFtdXG5cbiAgaWYgKGluZGllICYmIHR5cGVvZiBpbmRpZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAodHlwZW9mIGluZGllLm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdJbmRpZS5uYW1lIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtZXNzYWdlcy5wdXNoKCdJbmRpZSBtdXN0IGJlIGFuIG9iamVjdCcpXG4gIH1cblxuICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgc2hvd0Vycm9yKCdJbnZhbGlkIEluZGllIHJlY2VpdmVkJywgYFRoZXNlIGlzc3VlcyB3ZXJlIGVuY291bnRlcmVkIHdoaWxlIHJlZ2lzdGVyaW5nIGFuIEluZGllIExpbnRlciBuYW1lZCAnJHtpbmRpZSAmJiBpbmRpZS5uYW1lID8gaW5kaWUubmFtZSA6ICdVbmtub3duJ30nYCwgbWVzc2FnZXMpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1lc3NhZ2VzKGxpbnRlck5hbWU6IHN0cmluZywgZW50cmllczogQXJyYXk8TWVzc2FnZT4pOiBib29sZWFuIHtcbiAgY29uc3QgbWVzc2FnZXMgPSBbXVxuXG4gIGlmIChBcnJheS5pc0FycmF5KGVudHJpZXMpKSB7XG4gICAgbGV0IGludmFsaWRVUkwgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkSWNvbiA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRFeGNlcnB0ID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZExvY2F0aW9uID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZFNldmVyaXR5ID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZFNvbHV0aW9uID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZFJlZmVyZW5jZSA9IGZhbHNlXG4gICAgbGV0IGludmFsaWREZXNjcmlwdGlvbiA9IGZhbHNlXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGVudHJpZXNbaV1cbiAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IG1lc3NhZ2UucmVmZXJlbmNlXG4gICAgICBpZiAoIWludmFsaWRJY29uICYmIG1lc3NhZ2UuaWNvbiAmJiB0eXBlb2YgbWVzc2FnZS5pY29uICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkSWNvbiA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5pY29uIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkTG9jYXRpb24gJiYgKCFtZXNzYWdlLmxvY2F0aW9uIHx8IHR5cGVvZiBtZXNzYWdlLmxvY2F0aW9uICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgbWVzc2FnZS5sb2NhdGlvbi5maWxlICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbiAhPT0gJ29iamVjdCcgfHwgIW1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24pKSB7XG4gICAgICAgIGludmFsaWRMb2NhdGlvbiA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5sb2NhdGlvbiBtdXN0IGJlIHZhbGlkJylcbiAgICAgIH0gZWxzZSBpZiAoIWludmFsaWRMb2NhdGlvbikge1xuICAgICAgICBjb25zdCByYW5nZSA9IFJhbmdlLmZyb21PYmplY3QobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbilcbiAgICAgICAgaWYgKE51bWJlci5pc05hTihyYW5nZS5zdGFydC5yb3cpIHx8IE51bWJlci5pc05hTihyYW5nZS5zdGFydC5jb2x1bW4pIHx8IE51bWJlci5pc05hTihyYW5nZS5lbmQucm93KSB8fCBOdW1iZXIuaXNOYU4ocmFuZ2UuZW5kLmNvbHVtbikpIHtcbiAgICAgICAgICBpbnZhbGlkTG9jYXRpb24gPSB0cnVlXG4gICAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbiBzaG91bGQgbm90IGNvbnRhaW4gTmFOIGNvb3JkaW5hdGVzJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkU29sdXRpb24gJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgIUFycmF5LmlzQXJyYXkobWVzc2FnZS5zb2x1dGlvbnMpKSB7XG4gICAgICAgIGludmFsaWRTb2x1dGlvbiA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5zb2x1dGlvbnMgbXVzdCBiZSB2YWxpZCcpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRSZWZlcmVuY2UgJiYgcmVmZXJlbmNlICYmICh0eXBlb2YgcmVmZXJlbmNlICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgcmVmZXJlbmNlLmZpbGUgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiByZWZlcmVuY2UucG9zaXRpb24gIT09ICdvYmplY3QnIHx8ICFyZWZlcmVuY2UucG9zaXRpb24pKSB7XG4gICAgICAgIGludmFsaWRSZWZlcmVuY2UgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UucmVmZXJlbmNlIG11c3QgYmUgdmFsaWQnKVxuICAgICAgfSBlbHNlIGlmICghaW52YWxpZFJlZmVyZW5jZSAmJiByZWZlcmVuY2UpIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBQb2ludC5mcm9tT2JqZWN0KHJlZmVyZW5jZS5wb3NpdGlvbilcbiAgICAgICAgaWYgKE51bWJlci5pc05hTihwb3NpdGlvbi5yb3cpIHx8IE51bWJlci5pc05hTihwb3NpdGlvbi5jb2x1bW4pKSB7XG4gICAgICAgICAgaW52YWxpZFJlZmVyZW5jZSA9IHRydWVcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLnJlZmVyZW5jZS5wb3NpdGlvbiBzaG91bGQgbm90IGNvbnRhaW4gTmFOIGNvb3JkaW5hdGVzJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkRXhjZXJwdCAmJiB0eXBlb2YgbWVzc2FnZS5leGNlcnB0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkRXhjZXJwdCA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5leGNlcnB0IG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkU2V2ZXJpdHkgJiYgIVZBTElEX1NFVkVSSVRZLmhhcyhtZXNzYWdlLnNldmVyaXR5KSkge1xuICAgICAgICBpbnZhbGlkU2V2ZXJpdHkgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goXCJNZXNzYWdlLnNldmVyaXR5IG11c3QgYmUgJ2Vycm9yJywgJ3dhcm5pbmcnIG9yICdpbmZvJ1wiKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkVVJMICYmIG1lc3NhZ2UudXJsICYmIHR5cGVvZiBtZXNzYWdlLnVybCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgaW52YWxpZFVSTCA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS51cmwgbXVzdCBhIHN0cmluZycpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWREZXNjcmlwdGlvbiAmJiBtZXNzYWdlLmRlc2NyaXB0aW9uICYmIHR5cGVvZiBtZXNzYWdlLmRlc2NyaXB0aW9uICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBtZXNzYWdlLmRlc2NyaXB0aW9uICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkRGVzY3JpcHRpb24gPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UuZGVzY3JpcHRpb24gbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIHN0cmluZycpXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2VzLnB1c2goJ0xpbnRlciBSZXN1bHQgbXVzdCBiZSBhbiBBcnJheScpXG4gIH1cblxuICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgc2hvd0Vycm9yKCdJbnZhbGlkIExpbnRlciBSZXN1bHQgcmVjZWl2ZWQnLCBgVGhlc2UgaXNzdWVzIHdlcmUgZW5jb3VudGVyZWQgd2hpbGUgcHJvY2Vzc2luZyBtZXNzYWdlcyBmcm9tIGEgbGludGVyIG5hbWVkICcke2xpbnRlck5hbWV9J2AsIG1lc3NhZ2VzKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShsaW50ZXJOYW1lOiBzdHJpbmcsIGVudHJpZXM6IEFycmF5PE1lc3NhZ2VMZWdhY3k+KTogYm9vbGVhbiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gW11cblxuICBpZiAoQXJyYXkuaXNBcnJheShlbnRyaWVzKSkge1xuICAgIGxldCBpbnZhbGlkRml4ID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZFR5cGUgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkQ2xhc3MgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkUmFuZ2UgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkVHJhY2UgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkQ29udGVudCA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRGaWxlUGF0aCA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRTZXZlcml0eSA9IGZhbHNlXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGVudHJpZXNbaV1cbiAgICAgIGlmICghaW52YWxpZFR5cGUgJiYgdHlwZW9mIG1lc3NhZ2UudHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgaW52YWxpZFR5cGUgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UudHlwZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICAgIH1cbiAgICAgIGlmICghaW52YWxpZENvbnRlbnQgJiYgKCh0eXBlb2YgbWVzc2FnZS50ZXh0ICE9PSAnc3RyaW5nJyAmJiAodHlwZW9mIG1lc3NhZ2UuaHRtbCAhPT0gJ3N0cmluZycgJiYgIShtZXNzYWdlLmh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpKSB8fCAoIW1lc3NhZ2UudGV4dCAmJiAhbWVzc2FnZS5odG1sKSkpIHtcbiAgICAgICAgaW52YWxpZENvbnRlbnQgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UudGV4dCBvciBNZXNzYWdlLmh0bWwgbXVzdCBoYXZlIGEgdmFsaWQgdmFsdWUnKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkRmlsZVBhdGggJiYgbWVzc2FnZS5maWxlUGF0aCAmJiB0eXBlb2YgbWVzc2FnZS5maWxlUGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgaW52YWxpZEZpbGVQYXRoID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLmZpbGVQYXRoIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkUmFuZ2UgJiYgbWVzc2FnZS5yYW5nZSAmJiB0eXBlb2YgbWVzc2FnZS5yYW5nZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgaW52YWxpZFJhbmdlID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLnJhbmdlIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICAgIH0gZWxzZSBpZiAoIWludmFsaWRSYW5nZSAmJiBtZXNzYWdlLnJhbmdlKSB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChtZXNzYWdlLnJhbmdlKVxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKHJhbmdlLnN0YXJ0LnJvdykgfHwgTnVtYmVyLmlzTmFOKHJhbmdlLnN0YXJ0LmNvbHVtbikgfHwgTnVtYmVyLmlzTmFOKHJhbmdlLmVuZC5yb3cpIHx8IE51bWJlci5pc05hTihyYW5nZS5lbmQuY29sdW1uKSkge1xuICAgICAgICAgIGludmFsaWRSYW5nZSA9IHRydWVcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLnJhbmdlIHNob3VsZCBub3QgY29udGFpbiBOYU4gY29vcmRpbmF0ZXMnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRDbGFzcyAmJiBtZXNzYWdlLmNsYXNzICYmIHR5cGVvZiBtZXNzYWdlLmNsYXNzICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkQ2xhc3MgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UuY2xhc3MgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRTZXZlcml0eSAmJiBtZXNzYWdlLnNldmVyaXR5ICYmICFWQUxJRF9TRVZFUklUWS5oYXMobWVzc2FnZS5zZXZlcml0eSkpIHtcbiAgICAgICAgaW52YWxpZFNldmVyaXR5ID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKFwiTWVzc2FnZS5zZXZlcml0eSBtdXN0IGJlICdlcnJvcicsICd3YXJuaW5nJyBvciAnaW5mbydcIilcbiAgICAgIH1cbiAgICAgIGlmICghaW52YWxpZFRyYWNlICYmIG1lc3NhZ2UudHJhY2UgJiYgIUFycmF5LmlzQXJyYXkobWVzc2FnZS50cmFjZSkpIHtcbiAgICAgICAgaW52YWxpZFRyYWNlID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLnRyYWNlIG11c3QgYmUgYW4gQXJyYXknKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkRml4ICYmIG1lc3NhZ2UuZml4ICYmICh0eXBlb2YgbWVzc2FnZS5maXgucmFuZ2UgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBtZXNzYWdlLmZpeC5uZXdUZXh0ICE9PSAnc3RyaW5nJyB8fCAobWVzc2FnZS5maXgub2xkVGV4dCAmJiB0eXBlb2YgbWVzc2FnZS5maXgub2xkVGV4dCAhPT0gJ3N0cmluZycpKSkge1xuICAgICAgICBpbnZhbGlkRml4ID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLmZpeCBtdXN0IGJlIHZhbGlkJylcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWVzc2FnZXMucHVzaCgnTGludGVyIFJlc3VsdCBtdXN0IGJlIGFuIEFycmF5JylcbiAgfVxuXG4gIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICBzaG93RXJyb3IoJ0ludmFsaWQgTGludGVyIFJlc3VsdCByZWNlaXZlZCcsIGBUaGVzZSBpc3N1ZXMgd2VyZSBlbmNvdW50ZXJlZCB3aGlsZSBwcm9jZXNzaW5nIG1lc3NhZ2VzIGZyb20gYSBsaW50ZXIgbmFtZWQgJyR7bGludGVyTmFtZX0nYCwgbWVzc2FnZXMpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQge1xuICB2YWxpZGF0ZVVJIGFzIHVpLFxuICB2YWxpZGF0ZUxpbnRlciBhcyBsaW50ZXIsXG4gIHZhbGlkYXRlSW5kaWUgYXMgaW5kaWUsXG4gIHZhbGlkYXRlTWVzc2FnZXMgYXMgbWVzc2FnZXMsXG4gIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3kgYXMgbWVzc2FnZXNMZWdhY3ksXG59XG4iXX0=