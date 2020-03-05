function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-line import/no-unresolved

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

module.exports = {
  activate: function activate() {
    this.instance = new _main2["default"]();
  },
  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.instance.attach(statusBar);
  },
  providerRegistry: function providerRegistry() {
    return this.instance.registry;
  },
  provideBusySignal: function provideBusySignal() {
    var provider = this.instance.atomIdeProvider;
    return {
      reportBusyWhile: function reportBusyWhile(title, f, options) {
        return provider.reportBusyWhile(title, f, options);
      },

      reportBusy: function reportBusy(title, options) {
        return provider.reportBusy(title, options);
      },

      dispose: function dispose() {
        // nop
      }
    };
  },
  deactivate: function deactivate() {
    this.instance.dispose();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuYW5tYXkzLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQU11QixRQUFROzs7O0FBRy9CLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsUUFBUSxHQUFHLHVCQUFnQixDQUFDO0dBQ2xDO0FBQ0Qsa0JBQWdCLEVBQUEsMEJBQUMsU0FBaUIsRUFBRTtBQUNsQyxRQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUNqQztBQUNELGtCQUFnQixFQUFBLDRCQUFtQjtBQUNqQyxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0dBQy9CO0FBQ0QsbUJBQWlCLEVBQUEsNkJBQXNCO0FBQ3JDLFFBQU0sUUFBMkIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQztBQUNsRSxXQUFPO0FBQ0wscUJBQWUsRUFBRyx5QkFDaEIsS0FBYSxFQUNiLENBQW1CLEVBQ25CLE9BQTJCLEVBQzNCO0FBQ0EsZUFBTyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDcEQ7O0FBRUQsZ0JBQVUsRUFBQSxvQkFBQyxLQUFhLEVBQUUsT0FBMkIsRUFBRTtBQUNyRCxlQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzVDOztBQUVELGFBQU8sRUFBQSxtQkFBRzs7T0FFVDtLQUNGLENBQUM7R0FDSDtBQUNELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDekI7Q0FDRixDQUFDIiwiZmlsZSI6Ii9ob21lL2FuYW5tYXkzLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIHtcbiAgQnVzeVNpZ25hbFNlcnZpY2UsXG4gIEJ1c3lTaWduYWxPcHRpb25zXG59IGZyb20gXCJhdG9tLWlkZS9idXN5LXNpZ25hbFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgQnVzeVNpZ25hbCBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgdHlwZSBTaWduYWxSZWdpc3RyeSBmcm9tIFwiLi9yZWdpc3RyeVwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBCdXN5U2lnbmFsKCk7XG4gIH0sXG4gIGNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyOiBPYmplY3QpIHtcbiAgICB0aGlzLmluc3RhbmNlLmF0dGFjaChzdGF0dXNCYXIpO1xuICB9LFxuICBwcm92aWRlclJlZ2lzdHJ5KCk6IFNpZ25hbFJlZ2lzdHJ5IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZWdpc3RyeTtcbiAgfSxcbiAgcHJvdmlkZUJ1c3lTaWduYWwoKTogQnVzeVNpZ25hbFNlcnZpY2Uge1xuICAgIGNvbnN0IHByb3ZpZGVyOiBCdXN5U2lnbmFsU2VydmljZSA9IHRoaXMuaW5zdGFuY2UuYXRvbUlkZVByb3ZpZGVyO1xuICAgIHJldHVybiB7XG4gICAgICByZXBvcnRCdXN5V2hpbGU8VD4oXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICAgIGY6ICgpID0+IFByb21pc2U8VD4sXG4gICAgICAgIG9wdGlvbnM/OiBCdXN5U2lnbmFsT3B0aW9uc1xuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlci5yZXBvcnRCdXN5V2hpbGUodGl0bGUsIGYsIG9wdGlvbnMpO1xuICAgICAgfSxcblxuICAgICAgcmVwb3J0QnVzeSh0aXRsZTogc3RyaW5nLCBvcHRpb25zPzogQnVzeVNpZ25hbE9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyLnJlcG9ydEJ1c3kodGl0bGUsIG9wdGlvbnMpO1xuICAgICAgfSxcblxuICAgICAgZGlzcG9zZSgpIHtcbiAgICAgICAgLy8gbm9wXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmluc3RhbmNlLmRpc3Bvc2UoKTtcbiAgfVxufTtcbiJdfQ==