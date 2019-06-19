'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var atom = global.atom;
var crypto = require('crypto');

var decrypt = function decrypt(password, text) {
  try {
    var decipher = crypto.createDecipher('aes-256-ctr', password);
    var dec = decipher.update(text, 'hex', 'utf8');
    return dec;
  } catch (e) {
    return null;
  }
};

exports.decrypt = decrypt;
var encrypt = function encrypt(password, text) {
  try {
    var cipher = crypto.createCipher('aes-256-ctr', password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  } catch (e) {
    return null;
  }
};

exports.encrypt = encrypt;
var checkPasswordExists = function checkPasswordExists() {
  var passwordHash = atom.config.get('ftp-remote-edit.password');

  // migrate from ftp-remote-edit-plus
  if (!passwordHash) {
    passwordHash = atom.config.get('ftp-remote-edit-plus.password');
    if (passwordHash) {
      var servers = atom.config.get('ftp-remote-edit-plus.servers');
      atom.config.set('ftp-remote-edit.config', servers);
      atom.config.set('ftp-remote-edit.password', passwordHash);
    }
  }
  if (passwordHash) return true;

  return false;
};

exports.checkPasswordExists = checkPasswordExists;
var checkPassword = function checkPassword(password) {
  var passwordHash = atom.config.get('ftp-remote-edit.password');
  if (!passwordHash) return true;

  if (decrypt(password, passwordHash) !== password) {
    return false;
  }

  return true;
};

exports.checkPassword = checkPassword;
var setPassword = function setPassword(password) {
  var promise = new Promise(function (resolve, reject) {
    var passwordHash = encrypt(password, password);

    // Store in atom config
    atom.config.set('ftp-remote-edit.password', passwordHash);

    resolve(true);
  });

  return promise;
};

exports.setPassword = setPassword;
var changePassword = function changePassword(oldPassword, newPassword) {
  var promise = new Promise(function (resolve, reject) {
    var passwordHash = encrypt(newPassword, newPassword);

    // Store in atom config
    atom.config.set('ftp-remote-edit.password', passwordHash);

    var configHash = atom.config.get('ftp-remote-edit.config');
    if (configHash) {
      var oldconfig = decrypt(oldPassword, configHash);
      var newconfig = encrypt(newPassword, oldconfig);

      var oldWhitelist = getHashList(oldPassword, 'ftp-remote-edit.allowedConsumers');
      var oldBlacklist = getHashList(oldPassword, 'ftp-remote-edit.disallowedConsumers');

      // Store in atom config
      atom.config.set('ftp-remote-edit.config', newconfig);
      setHashList(newPassword, 'ftp-remote-edit.allowedConsumers', oldWhitelist);
      setHashList(newPassword, 'ftp-remote-edit.disallowedConsumers', oldBlacklist);
    }

    resolve(true);
  });

  return promise;
};

exports.changePassword = changePassword;
var isInWhiteList = function isInWhiteList(password, msg) {
  var hashes = getHashList(password, 'ftp-remote-edit.allowedConsumers');
  return hashes.indexOf(msg) > -1;
};

exports.isInWhiteList = isInWhiteList;
var isInBlackList = function isInBlackList(password, msg) {
  var hashes = getHashList(password, 'ftp-remote-edit.disallowedConsumers');
  return hashes.indexOf(msg) > -1;
};

exports.isInBlackList = isInBlackList;
var addToWhiteList = function addToWhiteList(password, msg) {
  addToHashList(password, 'ftp-remote-edit.allowedConsumers', msg);
};

exports.addToWhiteList = addToWhiteList;
var addToBlackList = function addToBlackList(password, msg) {
  addToHashList(password, 'ftp-remote-edit.disallowedConsumers', msg);
};

exports.addToBlackList = addToBlackList;
var getHashList = function getHashList(password, setting) {
  var conf = atom.config.get(setting);
  if (conf) {
    try {
      return JSON.parse(decrypt(password, conf));
    } catch (ex) {
      return [];
    }
  } else {
    return [];
  }
};

var setHashList = function setHashList(password, setting, hashes) {
  try {
    var str = JSON.stringify(hashes);
    atom.config.set(setting, encrypt(password, str));
  } catch (ex) {
    return [];
  }
};

var addToHashList = function addToHashList(password, setting, msg) {
  var hashes = getHashList(password, setting);
  hashes.push(msg);
  var str = JSON.stringify(hashes);
  atom.config.set(setting, encrypt(password, str));
};

var b64EncodeUnicode = function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
};

exports.b64EncodeUnicode = b64EncodeUnicode;
var b64DecodeUnicode = function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};
exports.b64DecodeUnicode = b64DecodeUnicode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuYW5tYXlqYWluLy5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvaGVscGVyL3NlY3VyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O0FBRVosSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTFCLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLFFBQVEsRUFBRSxJQUFJLEVBQUs7QUFDekMsTUFBSTtBQUNGLFFBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlELFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQyxXQUFPLEdBQUcsQ0FBQztHQUNaLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0YsQ0FBQTs7O0FBRU0sSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksUUFBUSxFQUFFLElBQUksRUFBSztBQUN6QyxNQUFJO0FBQ0YsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUQsUUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pELFdBQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLFdBQU8sT0FBTyxDQUFDO0dBQ2hCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0YsQ0FBQTs7O0FBRU0sSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsR0FBUztB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QUFDO0NBQ0wsQ0FBQTs7O0FBRU0sSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxHQUFHLEVBQUs7QUFDdkMsU0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBSztBQUN2RCxXQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzlELENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUNkLENBQUEiLCJmaWxlIjoiL2hvbWUvYW5hbm1heWphaW4vLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9oZWxwZXIvc2VjdXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IGF0b20gPSBnbG9iYWwuYXRvbTtcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5leHBvcnQgY29uc3QgZGVjcnlwdCA9IChwYXNzd29yZCwgdGV4dCkgPT4ge1xuICB0cnkge1xuICAgIGxldCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcignYWVzLTI1Ni1jdHInLCBwYXNzd29yZCk7XG4gICAgbGV0IGRlYyA9IGRlY2lwaGVyLnVwZGF0ZSh0ZXh0LCAnaGV4JywgJ3V0ZjgnKTtcbiAgICByZXR1cm4gZGVjO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGVuY3J5cHQgPSAocGFzc3dvcmQsIHRleHQpID0+IHtcbiAgdHJ5IHtcbiAgICBsZXQgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcignYWVzLTI1Ni1jdHInLCBwYXNzd29yZCk7XG4gICAgbGV0IGNyeXB0ZWQgPSBjaXBoZXIudXBkYXRlKHRleHQsICd1dGY4JywgJ2hleCcpO1xuICAgIGNyeXB0ZWQgKz0gY2lwaGVyLmZpbmFsKCdoZXgnKTtcbiAgICByZXR1cm4gY3J5cHRlZDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjaGVja1Bhc3N3b3JkRXhpc3RzID0gKCkgPT4ge1xuICBsZXQgcGFzc3dvcmRIYXNoID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQucGFzc3dvcmQnKTtcblxuICAvLyBtaWdyYXRlIGZyb20gZnRwLXJlbW90ZS1lZGl0LXBsdXNcbiAgaWYoIXBhc3N3b3JkSGFzaCl7XG4gICAgcGFzc3dvcmRIYXNoID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQtcGx1cy5wYXNzd29yZCcpO1xuICAgIGlmIChwYXNzd29yZEhhc2gpIHtcbiAgICAgIGxldCBzZXJ2ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQtcGx1cy5zZXJ2ZXJzJyk7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2Z0cC1yZW1vdGUtZWRpdC5jb25maWcnLCBzZXJ2ZXJzKTtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnZnRwLXJlbW90ZS1lZGl0LnBhc3N3b3JkJywgcGFzc3dvcmRIYXNoKTtcbiAgICB9XG4gIH1cbiAgaWYgKHBhc3N3b3JkSGFzaCkgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgY2hlY2tQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xuICBsZXQgcGFzc3dvcmRIYXNoID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQucGFzc3dvcmQnKTtcbiAgaWYgKCFwYXNzd29yZEhhc2gpIHJldHVybiB0cnVlO1xuXG4gIGlmIChkZWNyeXB0KHBhc3N3b3JkLCBwYXNzd29yZEhhc2gpICE9PSBwYXNzd29yZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgY29uc3Qgc2V0UGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHBhc3N3b3JkSGFzaCA9IGVuY3J5cHQocGFzc3dvcmQsIHBhc3N3b3JkKTtcblxuICAgIC8vIFN0b3JlIGluIGF0b20gY29uZmlnXG4gICAgYXRvbS5jb25maWcuc2V0KCdmdHAtcmVtb3RlLWVkaXQucGFzc3dvcmQnLCBwYXNzd29yZEhhc2gpO1xuXG4gICAgcmVzb2x2ZSh0cnVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBjb25zdCBjaGFuZ2VQYXNzd29yZCA9IChvbGRQYXNzd29yZCwgbmV3UGFzc3dvcmQpID0+IHtcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHBhc3N3b3JkSGFzaCA9IGVuY3J5cHQobmV3UGFzc3dvcmQsIG5ld1Bhc3N3b3JkKTtcblxuICAgIC8vIFN0b3JlIGluIGF0b20gY29uZmlnXG4gICAgYXRvbS5jb25maWcuc2V0KCdmdHAtcmVtb3RlLWVkaXQucGFzc3dvcmQnLCBwYXNzd29yZEhhc2gpO1xuXG4gICAgbGV0IGNvbmZpZ0hhc2ggPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC5jb25maWcnKTtcbiAgICBpZiAoY29uZmlnSGFzaCkge1xuICAgICAgbGV0IG9sZGNvbmZpZyA9IGRlY3J5cHQob2xkUGFzc3dvcmQsIGNvbmZpZ0hhc2gpO1xuICAgICAgbGV0IG5ld2NvbmZpZyA9IGVuY3J5cHQobmV3UGFzc3dvcmQsIG9sZGNvbmZpZyk7XG5cbiAgICAgIGxldCBvbGRXaGl0ZWxpc3QgPSBnZXRIYXNoTGlzdChvbGRQYXNzd29yZCwgJ2Z0cC1yZW1vdGUtZWRpdC5hbGxvd2VkQ29uc3VtZXJzJyk7XG4gICAgICBsZXQgb2xkQmxhY2tsaXN0ID0gZ2V0SGFzaExpc3Qob2xkUGFzc3dvcmQsICdmdHAtcmVtb3RlLWVkaXQuZGlzYWxsb3dlZENvbnN1bWVycycpO1xuXG4gICAgICAvLyBTdG9yZSBpbiBhdG9tIGNvbmZpZ1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdmdHAtcmVtb3RlLWVkaXQuY29uZmlnJywgbmV3Y29uZmlnKTtcbiAgICAgIHNldEhhc2hMaXN0KG5ld1Bhc3N3b3JkLCAnZnRwLXJlbW90ZS1lZGl0LmFsbG93ZWRDb25zdW1lcnMnLCBvbGRXaGl0ZWxpc3QpO1xuICAgICAgc2V0SGFzaExpc3QobmV3UGFzc3dvcmQsICdmdHAtcmVtb3RlLWVkaXQuZGlzYWxsb3dlZENvbnN1bWVycycsIG9sZEJsYWNrbGlzdCk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZSh0cnVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBjb25zdCBpc0luV2hpdGVMaXN0ID0gKHBhc3N3b3JkLCBtc2cpID0+IHtcbiAgbGV0IGhhc2hlcyA9IGdldEhhc2hMaXN0KHBhc3N3b3JkLCAnZnRwLXJlbW90ZS1lZGl0LmFsbG93ZWRDb25zdW1lcnMnKTtcbiAgcmV0dXJuIGhhc2hlcy5pbmRleE9mKG1zZykgPiAtMVxufVxuXG5leHBvcnQgY29uc3QgaXNJbkJsYWNrTGlzdCA9IChwYXNzd29yZCwgbXNnKSA9PiB7XG4gIGxldCBoYXNoZXMgPSBnZXRIYXNoTGlzdChwYXNzd29yZCwgJ2Z0cC1yZW1vdGUtZWRpdC5kaXNhbGxvd2VkQ29uc3VtZXJzJyk7XG4gIHJldHVybiBoYXNoZXMuaW5kZXhPZihtc2cpID4gLTFcbn1cblxuZXhwb3J0IGNvbnN0IGFkZFRvV2hpdGVMaXN0ID0gKHBhc3N3b3JkLCBtc2cpID0+IHtcbiAgYWRkVG9IYXNoTGlzdChwYXNzd29yZCwgJ2Z0cC1yZW1vdGUtZWRpdC5hbGxvd2VkQ29uc3VtZXJzJywgbXNnKTtcbn1cblxuZXhwb3J0IGNvbnN0IGFkZFRvQmxhY2tMaXN0ID0gKHBhc3N3b3JkLCBtc2cpID0+IHtcbiAgYWRkVG9IYXNoTGlzdChwYXNzd29yZCwgJ2Z0cC1yZW1vdGUtZWRpdC5kaXNhbGxvd2VkQ29uc3VtZXJzJywgbXNnKTtcbn1cblxuY29uc3QgZ2V0SGFzaExpc3QgPSAocGFzc3dvcmQsIHNldHRpbmcpID0+IHtcbiAgbGV0IGNvbmYgPSBhdG9tLmNvbmZpZy5nZXQoc2V0dGluZyk7XG4gIGlmIChjb25mKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlY3J5cHQocGFzc3dvcmQsIGNvbmYpKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmNvbnN0IHNldEhhc2hMaXN0ID0gKHBhc3N3b3JkLCBzZXR0aW5nLCBoYXNoZXMpID0+IHtcbiAgdHJ5IHtcbiAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkoaGFzaGVzKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoc2V0dGluZywgZW5jcnlwdChwYXNzd29yZCwgc3RyKSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuY29uc3QgYWRkVG9IYXNoTGlzdCA9IChwYXNzd29yZCwgc2V0dGluZywgbXNnKSA9PiB7XG4gIGxldCBoYXNoZXMgPSBnZXRIYXNoTGlzdChwYXNzd29yZCwgc2V0dGluZyk7XG4gIGhhc2hlcy5wdXNoKG1zZyk7XG4gIGxldCBzdHIgPSBKU09OLnN0cmluZ2lmeShoYXNoZXMpO1xuICBhdG9tLmNvbmZpZy5zZXQoc2V0dGluZywgZW5jcnlwdChwYXNzd29yZCwgc3RyKSk7XG59XG5cbmV4cG9ydCBjb25zdCBiNjRFbmNvZGVVbmljb2RlID0gKHN0cikgPT4ge1xuICByZXR1cm4gYnRvYShlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLCAobWF0Y2gsIHAxKSA9PiB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgfSkpO1xufVxuXG5leHBvcnQgY29uc3QgYjY0RGVjb2RlVW5pY29kZSA9IChzdHIpID0+IHtcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChhdG9iKHN0cikuc3BsaXQoJycpLm1hcCgoYykgPT4ge1xuICAgIHJldHVybiAnJScgKyAoJzAwJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgfSkuam9pbignJykpO1xufVxuIl19