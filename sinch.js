function unique() {
    return "x" + ++NOW + +new Date }

function rnow() {
    return +new Date }

function build_url(a, b) {
    var c = a.join(URLBIT),
        d = [];
    return b ? (each(b, function(a, b) {
        var c = "object" == typeof b ? JSON.stringify(b) : b; "undefined" != typeof b && null != b && encode(c).length > 0 && d.push(a + "=" + encode(c)) }), c += "?" + d.join(PARAMSBIT)) : c }

function updater(a, b) {
    var c, d = 0,
        e = function() { d + b > rnow() ? (clearTimeout(c), c = setTimeout(e, b)) : (d = rnow(), a()) };
    return e }

function grep(a, b) {
    var c = [];
    return each(a || [], function(a) { b(a) && c.push(a) }), c }

function supplant(a, b) {
    return a.replace(REPL, function(a, c) {
        return b[c] || a }) }

function timeout(a, b) {
    return setTimeout(a, b) }

function uuid(a) {
    var b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
        var b = 16 * Math.random() | 0,
            c = "x" == a ? b : 3 & b | 8;
        return c.toString(16) });
    return a && a(b), b }

function isArray(a) {
    return !!a && Array.isArray && Array.isArray(a) }

function each(a, b) {
    if (a && b)
        if (isArray(a))
            for (var c = 0, d = a.length; d > c;) b.call(a[c], a[c], c++);
        else
            for (var c in a) a.hasOwnProperty && a.hasOwnProperty(c) && b.call(a[c], c, a[c]) }

function map(a, b) {
    var c = [];
    return each(a || [], function(a, d) { c.push(b(a, d)) }), c }

function encode(a) {
    return encodeURIComponent(a) }

function generate_channel_list(a, b) {
    var c = [];
    return each(a, function(a, d) { b ? a.search("-pnpres") < 0 && d.subscribed && c.push(a) : d.subscribed && c.push(a) }), c.sort() }

function generate_channel_groups_list(a, b) {
    var c = [];
    return each(a, function(a, d) { b ? channel.search("-pnpres") < 0 && d.subscribed && c.push(a) : d.subscribed && c.push(a) }), c.sort() }

function ready() { timeout(function() { READY || (READY = 1, each(READY_BUFFER, function(a) { a() })) }, SECOND) }

function PNmessage(a) {
    return msg = a || { apns: {} }, msg.getPubnubMessage = function() {
        var a = {};
        if (Object.keys(msg.apns).length) { a.pn_apns = { aps: { alert: msg.apns.alert, badge: msg.apns.badge } };
            for (var b in msg.apns) a.pn_apns[b] = msg.apns[b];
            var c = ["badge", "alert"];
            for (var b in c) delete a.pn_apns[c[b]] }
        msg.gcm && (a.pn_gcm = { data: msg.gcm });
        for (var b in msg) a[b] = msg[b];
        var d = ["apns", "gcm", "publish", "channel", "callback", "error"];
        for (var b in d) delete a[d[b]];
        return a }, msg.publish = function() {
        var a = msg.getPubnubMessage();
        msg.pubnub && msg.channel && msg.pubnub.publish({ message: a, channel: msg.channel, callback: msg.callback, error: msg.error }) }, msg }

function PN_API(a) {
    function b(a) {
        return a || (a = {}), each(da, function(b, c) { b in a || (a[b] = c) }), a }

    function c(a) {
        var b = [];
        return each(a, function(a, c) { b.push(a) }), b }

    function d(a) {
        return c(a).sort() }

    function e(a) {
        var b = "",
            c = d(a);
        for (var e in c) {
            var f = c[e];
            b += f + "=" + encode(a[f]), e != c.length - 1 && (b += "&") }
        return b }

    function f(a, b, c) {
        var d = !1;
        if ("number" == typeof a) d = a > PRESENCE_HB_THRESHOLD || 0 == a ? !1 : !0;
        else {
            if ("boolean" == typeof a) return a ? PRESENCE_HB_DEFAULT : 0;
            d = !0 }
        return d ? (c && c("Presence Heartbeat value invalid. Valid range ( x > " + PRESENCE_HB_THRESHOLD + " or x = 0). Current Value : " + (b || PRESENCE_HB_THRESHOLD)), b || PRESENCE_HB_THRESHOLD) : a }

    function g(a, b) {
        return ka.encrypt(a, b || ia) || a }

    function h(a, b) {
        return ka.decrypt(a, b || ia) || ka.decrypt(a, ia) || a }

    function i() {
        return clearTimeout(Y), !$ || $ >= 500 || 1 > $ || !generate_channel_list(V, !0).length ? void(_ = !1) : (_ = !0, void la.presence_heartbeat({ callback: function(a) { Y = timeout(i, $ * SECOND) }, error: function(a) { ea && ea("Presence Heartbeat unable to reach Pubnub servers." + JSON.stringify(a)), Y = timeout(i, $ * SECOND) } })) }

    function j() {!_ && i() }

    function l(a) {
        if (aa) {
            if (!M.length) return } else {
            if (a && (M.sending = 0), M.sending || !M.length) return;
            M.sending = 1 }
        ca(M.shift()) }

    function m(a) {
        var b = 0;
        return each(generate_channel_list(V), function(c) {
            var d = V[c];
            d && (b++, (a || function() {})(d)) }), b }

    function o(a, b, c) {
        if ("object" == typeof a) {
            if (a.error && a.message && a.payload) return void c({ message: a.message, payload: a.payload });
            if (a.payload) return void b(a.payload) }
        b(a) }

    function p(a, b) { b("object" == typeof a && a.error && a.message && a.payload ? { message: a.message, payload: a.payload } : a) }

    function q(a, c, d, e) {
        var c = a.callback || c,
            f = a.error || ea,
            g = ga(),
            h = [J, "v1", "channel-registration", "sub-key", D];
        h.push.apply(h, d), ca({ callback: g, data: b(e), success: function(a) { o(a, c, f) }, fail: function(a) { p(a, f) }, url: h }) }

    function r() { fa() || t(1, { error: "Offline. Please check your network settings. " }), w && clearTimeout(w), w = timeout(r, SECOND) }

    function s() { la.time(function(a) { v(function() {}, a), a || t(1, { error: "Heartbeat failed to connect to Pubnub Servers.Please check your network settings." }), x && clearTimeout(x), x = timeout(s, A) }) }

    function t(a, b) { R && R(a, b), R = null, clearTimeout(w), clearTimeout(x) }

    function u(a) {
        var b = rnow() - O;
        return b - a / 1e4 }

    function v(a, b) {
        function c(b) {
            if (b) {
                var c = b / 1e4,
                    e = (rnow() - d) / 2;
                O = rnow() - (c + e), a && a(O) } }
        var d = rnow();
        b && c(b) || la.time(c) }
    var w, x, y = +a.windowing || DEF_WINDOWING,
        z = (+a.timeout || DEF_SUB_TIMEOUT) * SECOND,
        A = (+a.keepalive || DEF_KEEPALIVE) * SECOND,
        B = a.noleave || 0,
        C = a.publish_key || "demo",
        D = a.subscribe_key || "demo",
        E = a.auth_key || "",
        F = a.secret_key || "",
        G = a.hmac_SHA256,
        H = a.ssl ? "s" : "",
        I = "http" + H + "://" + (a.origin || "pubsub.pubnub.com"),
        J = nextorigin(I),
        K = nextorigin(I),
        L = function() {},
        M = [],
        N = !0,
        O = 0,
        P = 0,
        Q = 0,
        R = 0,
        S = a.restore || 0,
        T = 0,
        U = !1,
        V = {},
        W = {},
        X = {},
        Y = null,
        Z = f(a.heartbeat || a.pnexpires || 0, a.error),
        $ = a.heartbeat_interval || Z - 3,
        _ = !1,
        aa = a.no_wait_for_pending,
        ba = a["compatible_3.5"] || !1,
        ca = a.xdr,
        da = a.params || {},
        ea = a.error || function() {},
        fa = a._is_online || function() {
            return 1 },
        ga = a.jsonp_cb || function() {
            return 0 },
        ha = a.db || { get: function() {}, set: function() {} },
        ia = a.cipher_key,
        ja = a.uuid || ha && ha.get(D + "uuid") || "",
        ka = a.crypto_obj || { encrypt: function(a, b) {
                return a }, decrypt: function(a, b) {
                return a } },
        la = { LEAVE: function(a, c, d, e) {
                var f = { uuid: ja, auth: E },
                    g = nextorigin(I),
                    d = d || function() {},
                    h = e || function() {},
                    i = ga();
                if (a.indexOf(PRESENCE_SUFFIX) > 0) return !0;
                if (ba) {
                    if (!H) return !1;
                    if ("0" == i) return !1 }
                return B ? !1 : ("0" != i && (f.callback = i), ca({ blocking: c || H, timeout: 2e3, callback: i, data: b(f), success: function(a) { o(a, d, h) }, fail: function(a) { p(a, h) }, url: [g, "v2", "presence", "sub_key", D, "channel", encode(a), "leave"] }), !0) }, set_resumed: function(a) { U = a }, get_cipher_key: function() {
                return ia }, set_cipher_key: function(a) { ia = a }, raw_encrypt: function(a, b) {
                return g(a, b) }, raw_decrypt: function(a, b) {
                return h(a, b) }, get_heartbeat: function() {
                return Z }, set_heartbeat: function(a) { Z = f(a, $, ea), $ = Z - 3 >= 1 ? Z - 3 : 1, L(), i() }, get_heartbeat_interval: function() {
                return $ }, set_heartbeat_interval: function(a) { $ = a, i() }, get_version: function() {
                return SDK_VER }, getGcmMessageObject: function(a) {
                return { data: a } }, getApnsMessageObject: function(a) {
                var b = { aps: { badge: 1, alert: "" } };
                for (k in a) k[b] = a[k];
                return b }, newPnMessage: function() {
                var a = {};
                gcm && (a.pn_gcm = gcm), apns && (a.pn_apns = apns);
                for (k in n) a[k] = n[k];
                return a }, _add_param: function(a, b) { da[a] = b }, channel_group: function(a, b) {
                var c, d, e = a.channel_group,
                    f = a.channels || a.channel,
                    g = a.cloak,
                    h = [],
                    i = {},
                    j = a.mode || "add";
                if (e) {
                    var k = e.split(":");
                    k.length > 1 ? (c = "*" === k[0] ? null : k[0], d = k[1]) : d = k[0] }
                c && h.push("namespace") && h.push(encode(c)), h.push("channel-group"), d && "*" !== d && h.push(d), f ? (isArray(f) && (f = f.join(",")), i[j] = f, i.cloak = N ? "true" : "false") : "remove" === j && h.push("remove"), "undefined" != typeof g && (i.cloak = g ? "true" : "false"), q(a, b, h, i) }, channel_group_list_groups: function(a, b) {
                var c;
                c = a.namespace || a.ns || a.channel_group || null, c && (a.channel_group = c + ":*"), la.channel_group(a, b) }, channel_group_list_channels: function(a, b) {
                return a.channel_group ? void la.channel_group(a, b) : ea("Missing Channel Group") }, channel_group_remove_channel: function(a, b) {
                return a.channel_group ? a.channel || a.channels ? (a.mode = "remove", void la.channel_group(a, b)) : ea("Missing Channel") : ea("Missing Channel Group") }, channel_group_remove_group: function(a, b) {
                return a.channel_group ? a.channel ? ea("Use channel_group_remove_channel if you want to remove a channel from a group.") : (a.mode = "remove", void la.channel_group(a, b)) : ea("Missing Channel Group") }, channel_group_add_channel: function(a, b) {
                return a.channel_group ? a.channel || a.channels ? void la.channel_group(a, b) : ea("Missing Channel") : ea("Missing Channel Group") }, channel_group_cloak: function(a, b) {
                return "undefined" == typeof a.cloak ? void b(N) : (N = a.cloak, void la.channel_group(a, b)) }, channel_group_list_namespaces: function(a, b) {
                var c = ["namespace"];
                q(a, b, c) }, channel_group_remove_namespace: function(a, b) {
                var c = ["namespace", a.namespace, "remove"];
                q(a, b, c) }, history: function(a, c) {
                var c = a.callback || c,
                    d = a.count || a.limit || 100,
                    e = a.reverse || "false",
                    f = a.error || function() {},
                    g = a.auth_key || E,
                    i = a.cipher_key,
                    j = a.channel,
                    k = a.channel_group,
                    l = a.start,
                    m = a.end,
                    n = a.include_token,
                    o = {},
                    q = ga();
                return j || k ? c ? D ? (o.stringtoken = "true", o.count = d, o.reverse = e, o.auth = g, k && (o["channel-group"] = k, j || (j = ",")), q && (o.callback = q), l && (o.start = l), m && (o.end = m), n && (o.include_token = "true"), void ca({ callback: q, data: b(o), success: function(a) {
                        if ("object" == typeof a && a.error) return void f({ message: a.message, payload: a.payload });
                        for (var b = a[0], d = [], e = 0; e < b.length; e++) {
                            var g = h(b[e], i);
                            try { d.push(JSON.parse(g)) } catch (j) { d.push(g) } }
                        c([d, a[1], a[2]]) }, fail: function(a) { p(a, f) }, url: [J, "v2", "history", "sub-key", D, "channel", encode(j)] })) : ea("Missing Subscribe Key") : ea("Missing Callback") : ea("Missing Channel") }, replay: function(a, c) {
                var d, c = c || a.callback || function() {},
                    e = a.auth_key || E,
                    f = a.source,
                    g = a.destination,
                    h = a.stop,
                    i = a.start,
                    j = a.end,
                    k = a.reverse,
                    l = a.limit,
                    m = ga(),
                    n = {};
                return f ? g ? C ? D ? ("0" != m && (n.callback = m), h && (n.stop = "all"), k && (n.reverse = "true"), i && (n.start = i), j && (n.end = j), l && (n.count = l), n.auth = e, d = [J, "v1", "replay", C, D, f, g], void ca({ callback: m, success: function(a) { o(a, c, err) }, fail: function() { c([0, "Disconnected"]) }, url: d, data: b(n) })) : ea("Missing Subscribe Key") : ea("Missing Publish Key") : ea("Missing Destination Channel") : ea("Missing Source Channel") }, auth: function(a) { E = a, L() }, time: function(a) {
                var c = ga();
                ca({ callback: c, data: b({ uuid: ja, auth: E }), timeout: 5 * SECOND, url: [J, "time", c], success: function(b) { a(b[0]) }, fail: function() { a(0) } }) }, publish: function(a, c) {
                var d = a.message;
                if (!d) return ea("Missing Message");
                var e, c = c || a.callback || d.callback || function() {},
                    f = a.channel || d.channel,
                    h = a.auth_key || E,
                    i = a.cipher_key,
                    j = a.error || d.error || function() {},
                    k = a.post || !1,
                    m = "store_in_history" in a ? a.store_in_history : !0,
                    n = ga(),
                    q = "push";
                return a.prepend && (q = "unshift"), f ? C ? D ? (d.getPubnubMessage && (d = d.getPubnubMessage()), d = JSON.stringify(g(d, i)), e = [J, "publish", C, D, 0, encode(f), n, encode(d)], da = { uuid: ja, auth: h }, m || (da.store = "0"), M[q]({ callback: n, timeout: 5 * SECOND, url: e, data: b(da), fail: function(a) { p(a, j), l(1) }, success: function(a) { o(a, c, j), l(1) }, mode: k ? "POST" : "GET" }), void l()) : ea("Missing Subscribe Key") : ea("Missing Publish Key") : ea("Missing Channel") }, unsubscribe: function(a, b) {
                var c = a.channel,
                    d = a.channel_group,
                    b = b || a.callback || function() {},
                    e = a.error || function() {};
                T = 0, c && (c = map((c.join ? c.join(",") : "" + c).split(","), function(a) {
                    return V[a] ? a + "," + a + PRESENCE_SUFFIX : void 0 }).join(","), each(c.split(","), function(a) {
                    var c = !0;
                    a && (READY && (c = la.LEAVE(a, 0, b, e)), c || b({ action: "leave" }), V[a] = 0, a in X && delete X[a]) })), d && (d = map((d.join ? d.join(",") : "" + d).split(","), function(a) {
                    return W[a] ? a + "," + a + PRESENCE_SUFFIX : void 0 }).join(","), each(d.split(","), function(a) {
                    var c = !0;
                    d && (READY && (c = la.LEAVE(d, 0, b, e)), c || b({ action: "leave" }), W[d] = 0, d in X && delete X[d]) })), L() }, subscribe: function(a, c) {
                function d(a) { a ? timeout(L, SECOND) : (J = nextorigin(I, 1), K = nextorigin(I, 1), timeout(function() { la.time(d) }, SECOND)), m(function(b) {
                        return a && b.disconnected ? (b.disconnected = 0, b.reconnect(b.name)) : void(a || b.disconnected || (b.disconnected = 1, b.disconnect(b.name))) }) }

                function e() {
                    var a = ga(),
                        c = generate_channel_list(V).join(","),
                        f = generate_channel_groups_list(W).join(",");
                    if (c || f) { c || (c = ","), t();
                        var g = b({ uuid: ja, auth: i });
                        f && (g["channel-group"] = f);
                        var k = JSON.stringify(X);
                        k.length > 2 && (g.state = JSON.stringify(X)), Z && (g.heartbeat = Z), j(), R = ca({ timeout: x, callback: a, fail: function(a) { p(a, o), la.time(d) }, data: b(g), url: [K, "subscribe", D, encode(c), a, T], success: function(a) {
                                if (!a || "object" == typeof a && "error" in a && a.error) return o(a.error), timeout(L, SECOND);
                                if (q(a[1]), T = !T && S && ha.get(D) || a[1], m(function(a) { a.connected || (a.connected = 1, a.connect(a.name)) }), U && !S) return T = 0, U = !1, ha.set(D, 0), void timeout(e, A);
                                v && (T = 1e4, v = 0), ha.set(D, a[1]);
                                var b = function() {
                                        var b = "";
                                        b = a.length > 3 ? a[3] : a.length > 2 ? a[2] : map(generate_channel_list(V), function(b) {
                                            return map(Array(a[0].length).join(",").split(","), function() {
                                                return b }) }).join(",");
                                        var c = b.split(",");
                                        return function() {
                                            var a = c.shift() || Q;
                                            return [(V[a] || {}).callback || P, a.split(PRESENCE_SUFFIX)[0]] } }(),
                                    c = u(+a[1]);
                                each(a[0], function(d) {
                                    var e = b(),
                                        f = h(d, V[e[1]] ? V[e[1]].cipher_key : null);
                                    e[0](f, a, e[2] || e[1], c) }), timeout(e, A) } }) } }
                var f = a.channel,
                    g = a.channel_group,
                    c = c || a.callback,
                    c = c || a.message,
                    i = a.auth_key || E,
                    k = a.connect || function() {},
                    l = a.reconnect || function() {},
                    n = a.disconnect || function() {},
                    o = a.error || function() {},
                    q = a.idle || function() {},
                    r = a.presence || 0,
                    s = a.noheresync || 0,
                    v = a.backfill || 0,
                    w = a.timetoken || 0,
                    x = a.timeout || z,
                    A = a.windowing || y,
                    B = a.state,
                    C = a.heartbeat || a.pnexpires,
                    F = a.restore || S;
                return S = F, T = w, f || g ? c ? D ? ((C || 0 === C) && la.set_heartbeat(C), f && each((f.join ? f.join(",") : "" + f).split(","), function(b) {
                    var d = V[b] || {};
                    V[Q = b] = { name: b, connected: d.connected, disconnected: d.disconnected, subscribed: 1, callback: P = c, cipher_key: a.cipher_key, connect: k, disconnect: n, reconnect: l }, B && (b in B ? X[b] = B[b] : X[b] = B), r && (la.subscribe({ channel: b + PRESENCE_SUFFIX, callback: r, restore: F }), d.subscribed || s || la.here_now({ channel: b, callback: function(a) { each("uuids" in a ? a.uuids : [], function(c) { r({ action: "join", uuid: c, timestamp: Math.floor(rnow() / 1e3), occupancy: a.occupancy || 1 }, a, b) }) } })) }), g && each((g.join ? g.join(",") : "" + g).split(","), function(b) {
                    var d = W[b] || {};
                    W[b] = { name: b, connected: d.connected, disconnected: d.disconnected, subscribed: 1, callback: P = c, cipher_key: a.cipher_key, connect: k, disconnect: n, reconnect: l }, r && (la.subscribe({ channel_group: b + PRESENCE_SUFFIX, callback: r, restore: F }), d.subscribed || s || la.here_now({ channel_group: b, callback: function(a) { each("uuids" in a ? a.uuids : [], function(c) { r({ action: "join", uuid: c, timestamp: Math.floor(rnow() / 1e3), occupancy: a.occupancy || 1 }, a, b) }) } })) }), L = function() { t(), timeout(e, A) }, READY ? void L() : READY_BUFFER.push(L)) : ea("Missing Subscribe Key") : ea("Missing Callback") : ea("Missing Channel") }, here_now: function(a, c) {
                var c = a.callback || c,
                    d = a.error || function() {},
                    e = a.auth_key || E,
                    f = a.channel,
                    g = a.channel_group,
                    h = ga(),
                    i = "uuids" in a ? a.uuids : !0,
                    j = a.state,
                    k = { uuid: ja, auth: e };
                if (i || (k.disable_uuids = 1), j && (k.state = 1), !c) return ea("Missing Callback");
                if (!D) return ea("Missing Subscribe Key");
                var l = [J, "v2", "presence", "sub_key", D];
                f && l.push("channel") && l.push(encode(f)), "0" != h && (k.callback = h), g && (k["channel-group"] = g, !f && l.push("channel") && l.push(",")), ca({ callback: h, data: b(k), success: function(a) { o(a, c, d) }, fail: function(a) { p(a, d) }, url: l }) }, where_now: function(a, c) {
                var c = a.callback || c,
                    d = a.error || function() {},
                    e = a.auth_key || E,
                    f = ga(),
                    g = a.uuid || ja,
                    h = { auth: e };
                return c ? D ? ("0" != f && (h.callback = f), void ca({ callback: f, data: b(h), success: function(a) { o(a, c, d) }, fail: function(a) { p(a, d) }, url: [J, "v2", "presence", "sub_key", D, "uuid", encode(g)] })) : ea("Missing Subscribe Key") : ea("Missing Callback") }, state: function(a, c) {
                var d, c = a.callback || c || function(a) {},
                    e = a.error || function() {},
                    f = a.auth_key || E,
                    g = ga(),
                    h = a.state,
                    i = a.uuid || ja,
                    j = a.channel,
                    k = a.channel_group,
                    l = b({ auth: f });
                return D ? i ? j || k ? ("0" != g && (l.callback = g), "undefined" != typeof j && V[j] && V[j].subscribed && h && (X[j] = h), "undefined" != typeof k && W[k] && W[k].subscribed && (h && (X[k] = h), l["channel-group"] = k, j || (j = ",")), l.state = JSON.stringify(h), d = h ? [J, "v2", "presence", "sub-key", D, "channel", j, "uuid", i, "data"] : [J, "v2", "presence", "sub-key", D, "channel", j, "uuid", encode(i)], void ca({ callback: g, data: b(l), success: function(a) { o(a, c, e) }, fail: function(a) { p(a, e) }, url: d })) : ea("Missing Channel") : ea("Missing UUID") : ea("Missing Subscribe Key") }, grant: function(a, c) {
                var c = a.callback || c,
                    d = a.error || function() {},
                    f = a.channel,
                    g = a.channel_group,
                    h = ga(),
                    i = a.ttl,
                    j = a.read ? "1" : "0",
                    k = a.write ? "1" : "0",
                    l = a.manage ? "1" : "0",
                    m = a.auth_key;
                if (!c) return ea("Missing Callback");
                if (!D) return ea("Missing Subscribe Key");
                if (!C) return ea("Missing Publish Key");
                if (!F) return ea("Missing Secret Key");
                var n = Math.floor((new Date).getTime() / 1e3),
                    q = D + "\n" + C + "\ngrant\n",
                    r = { w: k, r: j, timestamp: n };
                a.manage && (r.m = l), "undefined" != typeof f && null != f && f.length > 0 && (r.channel = f), "undefined" != typeof g && null != g && g.length > 0 && (r["channel-group"] = g), "0" != h && (r.callback = h), (i || 0 === i) && (r.ttl = i), m && (r.auth = m), r = b(r), m || delete r.auth, q += e(r);
                var s = G(q, F);
                s = s.replace(/\+/g, "-"), s = s.replace(/\//g, "_"), r.signature = s, ca({ callback: h, data: r, success: function(a) { o(a, c, d) }, fail: function(a) { p(a, d) }, url: [J, "v1", "auth", "grant", "sub-key", D] }) }, audit: function(a, c) {
                var c = a.callback || c,
                    d = a.error || function() {},
                    f = a.channel,
                    g = a.channel_group,
                    h = a.auth_key,
                    i = ga();
                if (!c) return ea("Missing Callback");
                if (!D) return ea("Missing Subscribe Key");
                if (!C) return ea("Missing Publish Key");
                if (!F) return ea("Missing Secret Key");
                var j = Math.floor((new Date).getTime() / 1e3),
                    k = D + "\n" + C + "\naudit\n",
                    l = { timestamp: j }; "0" != i && (l.callback = i), "undefined" != typeof f && null != f && f.length > 0 && (l.channel = f), "undefined" != typeof g && null != g && g.length > 0 && (l["channel-group"] = g), h && (l.auth = h), l = b(l), h || delete l.auth, k += e(l);
                var m = G(k, F);
                m = m.replace(/\+/g, "-"), m = m.replace(/\//g, "_"), l.signature = m, ca({ callback: i, data: l, success: function(a) { o(a, c, d) }, fail: function(a) { p(a, d) }, url: [J, "v1", "auth", "audit", "sub-key", D] }) }, revoke: function(a, b) { a.read = !1, a.write = !1, la.grant(a, b) }, set_uuid: function(a) { ja = a, L() }, get_uuid: function() {
                return ja }, presence_heartbeat: function(a) {
                var c = a.callback || function() {},
                    d = a.error || function() {},
                    e = ga(),
                    f = { uuid: ja, auth: E },
                    g = JSON.stringify(X);
                g.length > 2 && (f.state = JSON.stringify(X)), Z > 0 && 320 > Z && (f.heartbeat = Z), "0" != e && (f.callback = e);
                var h = encode(generate_channel_list(V, !0).join(",")),
                    i = generate_channel_groups_list(W, !0).join(",");
                h || (h = ","), i && (f["channel-group"] = i), ca({ callback: e, data: b(f), timeout: 5 * SECOND, url: [J, "v2", "presence", "sub-key", D, "channel", h, "heartbeat"], success: function(a) { o(a, c, d) }, fail: function(a) { p(a, d) } }) }, stop_timers: function() { clearTimeout(w), clearTimeout(x) }, xdr: ca, ready: ready, db: ha, uuid: uuid, map: map, each: each, "each-channel": m, grep: grep, offline: function() { t(1, { message: "Offline. Please check your network settings." }) }, supplant: supplant, now: rnow, unique: unique, updater: updater };
    return ja || (ja = la.uuid()), ha.set(D + "uuid", ja), w = timeout(r, SECOND), x = timeout(s, A), Y = timeout(j, ($ - 3) * SECOND), v(), la }

function crypto_obj() {
    function a(a) {
        function b(a, b) {
            var c = (65535 & a) + (65535 & b),
                d = (a >> 16) + (b >> 16) + (c >> 16);
            return d << 16 | 65535 & c }

        function c(a, b) {
            return a >>> b | a << 32 - b }

        function d(a, b) {
            return a >>> b }

        function e(a, b, c) {
            return a & b ^ ~a & c }

        function f(a, b, c) {
            return a & b ^ a & c ^ b & c }

        function g(a) {
            return c(a, 2) ^ c(a, 13) ^ c(a, 22) }

        function h(a) {
            return c(a, 6) ^ c(a, 11) ^ c(a, 25) }

        function i(a) {
            return c(a, 7) ^ c(a, 18) ^ d(a, 3) }

        function j(a) {
            return c(a, 17) ^ c(a, 19) ^ d(a, 10) }

        function k(a, c) {
            var d, k, l, m, n, o, p, q, r, s, t, u, v = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298),
                w = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
                x = new Array(64);
            a[c >> 5] |= 128 << 24 - c % 32, a[(c + 64 >> 9 << 4) + 15] = c;
            for (var r = 0; r < a.length; r += 16) { d = w[0], k = w[1], l = w[2], m = w[3], n = w[4], o = w[5], p = w[6], q = w[7];
                for (var s = 0; 64 > s; s++) 16 > s ? x[s] = a[s + r] : x[s] = b(b(b(j(x[s - 2]), x[s - 7]), i(x[s - 15])), x[s - 16]), t = b(b(b(b(q, h(n)), e(n, o, p)), v[s]), x[s]), u = b(g(d), f(d, k, l)), q = p, p = o, o = n, n = b(m, t), m = l, l = k, k = d, d = b(t, u);
                w[0] = b(d, w[0]), w[1] = b(k, w[1]), w[2] = b(l, w[2]), w[3] = b(m, w[3]), w[4] = b(n, w[4]), w[5] = b(o, w[5]), w[6] = b(p, w[6]), w[7] = b(q, w[7]) }
            return w }

        function l(a) {
            for (var b = Array(), c = (1 << o) - 1, d = 0; d < a.length * o; d += o) b[d >> 5] |= (a.charCodeAt(d / o) & c) << 24 - d % 32;
            return b }

        function m(a) { a = a.replace(/\r\n/g, "\n");
            for (var b = "", c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) }
            return b }

        function n(a) {
            for (var b = p ? "0123456789ABCDEF" : "0123456789abcdef", c = "", d = 0; d < 4 * a.length; d++) c += b.charAt(a[d >> 2] >> 8 * (3 - d % 4) + 4 & 15) + b.charAt(a[d >> 2] >> 8 * (3 - d % 4) & 15);
            return c }
        var o = 8,
            p = 0;
        return a = m(a), n(k(l(a), a.length * o)) }
    var b = CRYPTO;
    b.size(256);
    var c = b.s2a("0123456789012345");
    return { encrypt: function(d, e) {
            if (!e) return d;
            var f = b.s2a(a(e).slice(0, 32)),
                g = b.s2a(JSON.stringify(d)),
                h = b.rawEncrypt(g, f, c),
                i = b.Base64.encode(h);
            return i || d }, decrypt: function(d, e) {
            if (!e) return d;
            var f = b.s2a(a(e).slice(0, 32));
            try {
                var g = b.Base64.decode(d),
                    h = b.rawDecrypt(g, f, c, !1),
                    i = JSON.parse(h);
                return i } catch (j) {
                return void 0 } } } }
window.JSON && window.JSON.stringify || function() {
    function toJSON(a) {
        try {
            return this.valueOf() } catch (b) {
            return null } }

    function quote(a) {
        return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
            var b = meta[a];
            return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + a + '"' }

    function str(a, b) {
        var c, d, e, f, g, h = gap,
            i = b[a];
        switch (i && "object" == typeof i && (i = toJSON.call(i, a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
            case "string":
                return quote(i);
            case "number":
                return isFinite(i) ? String(i) : "null";
            case "boolean":
            case "null":
                return String(i);
            case "object":
                if (!i) return "null";
                if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                    for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
                    return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e }
                if (rep && "object" == typeof rep)
                    for (f = rep.length, c = 0; f > c; c += 1) d = rep[c], "string" == typeof d && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                else
                    for (d in i) Object.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e } }
    window.JSON || (window.JSON = {});
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = { "\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" },
        rep; "function" != typeof JSON.stringify && (JSON.stringify = function(a, b, c) {
        var d;
        if (gap = "", indent = "", "number" == typeof c)
            for (d = 0; c > d; d += 1) indent += " ";
        else "string" == typeof c && (indent = c);
        if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
        return str("", { "": a }) }), "function" != typeof JSON.parse && (JSON.parse = function(text) {
        return eval("(" + text + ")") }) }();
var NOW = 1,
    READY = !1,
    READY_BUFFER = [],
    PRESENCE_SUFFIX = "-pnpres",
    DEF_WINDOWING = 10,
    DEF_TIMEOUT = 1e4,
    DEF_SUB_TIMEOUT = 310,
    DEF_KEEPALIVE = 60,
    SECOND = 1e3,
    URLBIT = "/",
    PARAMSBIT = "&",
    PRESENCE_HB_THRESHOLD = 5,
    PRESENCE_HB_DEFAULT = 30,
    SDK_VER = "3.7.2",
    REPL = /{([\w\-]+)}/g,
    nextorigin = function() {
        var a = 20,
            b = Math.floor(Math.random() * a);
        return function(c, d) {
            return c.indexOf("pubsub.") > 0 && c.replace("pubsub", "ps" + (d ? uuid().split("-")[0] : ++b < a ? b : b = 1)) || c } }(),
    CRYPTO = function() {
        var a = 14,
            b = 8,
            c = !1,
            d = function(a) {
                try {
                    return unescape(encodeURIComponent(a)) } catch (b) {
                    throw "Error on UTF-8 encode" } },
            e = function(a) {
                try {
                    return decodeURIComponent(escape(a)) } catch (b) {
                    throw "Bad Key" } },
            f = function(a) {
                var b, c, d = [];
                for (a.length < 16 && (b = 16 - a.length, d = [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b]), c = 0; c < a.length; c++) d[c] = a[c];
                return d },
            g = function(a, b) {
                var c, d, e = "";
                if (b) {
                    if (c = a[15], c > 16) throw "Decryption error: Maybe bad key";
                    if (16 == c) return "";
                    for (d = 0; 16 - c > d; d++) e += String.fromCharCode(a[d]) } else
                    for (d = 0; 16 > d; d++) e += String.fromCharCode(a[d]);
                return e },
            h = function(a) {
                var b, c = "";
                for (b = 0; b < a.length; b++) c += (a[b] < 16 ? "0" : "") + a[b].toString(16);
                return c },
            j = function(a) {
                var b = [];
                return a.replace(/(..)/g, function(a) { b.push(parseInt(a, 16)) }), b },
            k = function(a, b) {
                var c, e = [];
                for (b || (a = d(a)), c = 0; c < a.length; c++) e[c] = a.charCodeAt(c);
                return e },
            l = function(c) {
                switch (c) {
                    case 128:
                        a = 10, b = 4;
                        break;
                    case 192:
                        a = 12, b = 6;
                        break;
                    case 256:
                        a = 14, b = 8;
                        break;
                    default:
                        throw "Invalid Key Size Specified:" + c } },
            m = function(a) {
                var b, c = [];
                for (b = 0; a > b; b++) c = c.concat(Math.floor(256 * Math.random()));
                return c },
            n = function(c, d) {
                var e, f = a >= 12 ? 3 : 2,
                    g = [],
                    h = [],
                    i = [],
                    j = [],
                    k = c.concat(d);
                for (i[0] = GibberishAES.Hash.MD5(k), j = i[0], e = 1; f > e; e++) i[e] = GibberishAES.Hash.MD5(i[e - 1].concat(k)), j = j.concat(i[e]);
                return g = j.slice(0, 4 * b), h = j.slice(4 * b, 4 * b + 16), { key: g, iv: h } },
            o = function(a, b, c) { b = x(b);
                var d, e = Math.ceil(a.length / 16),
                    g = [],
                    h = [];
                for (d = 0; e > d; d++) g[d] = f(a.slice(16 * d, 16 * d + 16));
                for (a.length % 16 === 0 && (g.push([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]), e++), d = 0; d < g.length; d++) g[d] = 0 === d ? w(g[d], c) : w(g[d], h[d - 1]), h[d] = q(g[d], b);
                return h },
            p = function(a, b, c, d) { b = x(b);
                var f, h = a.length / 16,
                    i = [],
                    j = [],
                    k = "";
                for (f = 0; h > f; f++) i.push(a.slice(16 * f, 16 * (f + 1)));
                for (f = i.length - 1; f >= 0; f--) j[f] = r(i[f], b), j[f] = 0 === f ? w(j[f], c) : w(j[f], i[f - 1]);
                for (f = 0; h - 1 > f; f++) k += g(j[f]);
                return k += g(j[f], !0), d ? k : e(k) },
            q = function(b, d) { c = !1;
                var e, f = v(b, d, 0);
                for (e = 1; a + 1 > e; e++) f = s(f), f = t(f), a > e && (f = u(f)), f = v(f, d, e);
                return f },
            r = function(b, d) { c = !0;
                var e, f = v(b, d, a);
                for (e = a - 1; e > -1; e--) f = t(f), f = s(f), f = v(f, d, e), e > 0 && (f = u(f));
                return f },
            s = function(a) {
                var b, d = c ? F : E,
                    e = [];
                for (b = 0; 16 > b; b++) e[b] = d[a[b]];
                return e },
            t = function(a) {
                var b, d = [],
                    e = c ? [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3] : [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11];
                for (b = 0; 16 > b; b++) d[b] = a[e[b]];
                return d },
            u = function(a) {
                var b, d = [];
                if (c)
                    for (b = 0; 4 > b; b++) d[4 * b] = M[a[4 * b]] ^ K[a[1 + 4 * b]] ^ L[a[2 + 4 * b]] ^ J[a[3 + 4 * b]], d[1 + 4 * b] = J[a[4 * b]] ^ M[a[1 + 4 * b]] ^ K[a[2 + 4 * b]] ^ L[a[3 + 4 * b]], d[2 + 4 * b] = L[a[4 * b]] ^ J[a[1 + 4 * b]] ^ M[a[2 + 4 * b]] ^ K[a[3 + 4 * b]], d[3 + 4 * b] = K[a[4 * b]] ^ L[a[1 + 4 * b]] ^ J[a[2 + 4 * b]] ^ M[a[3 + 4 * b]];
                else
                    for (b = 0; 4 > b; b++) d[4 * b] = H[a[4 * b]] ^ I[a[1 + 4 * b]] ^ a[2 + 4 * b] ^ a[3 + 4 * b], d[1 + 4 * b] = a[4 * b] ^ H[a[1 + 4 * b]] ^ I[a[2 + 4 * b]] ^ a[3 + 4 * b], d[2 + 4 * b] = a[4 * b] ^ a[1 + 4 * b] ^ H[a[2 + 4 * b]] ^ I[a[3 + 4 * b]], d[3 + 4 * b] = I[a[4 * b]] ^ a[1 + 4 * b] ^ a[2 + 4 * b] ^ H[a[3 + 4 * b]];
                return d },
            v = function(a, b, c) {
                var d, e = [];
                for (d = 0; 16 > d; d++) e[d] = a[d] ^ b[c][d];
                return e },
            w = function(a, b) {
                var c, d = [];
                for (c = 0; 16 > c; c++) d[c] = a[c] ^ b[c];
                return d },
            x = function(c) {
                var d, e, f, g, h = [],
                    i = [],
                    j = [];
                for (d = 0; b > d; d++) e = [c[4 * d], c[4 * d + 1], c[4 * d + 2], c[4 * d + 3]], h[d] = e;
                for (d = b; 4 * (a + 1) > d; d++) {
                    for (h[d] = [], f = 0; 4 > f; f++) i[f] = h[d - 1][f];
                    for (d % b === 0 ? (i = y(z(i)), i[0] ^= G[d / b - 1]) : b > 6 && d % b == 4 && (i = y(i)), f = 0; 4 > f; f++) h[d][f] = h[d - b][f] ^ i[f] }
                for (d = 0; a + 1 > d; d++)
                    for (j[d] = [], g = 0; 4 > g; g++) j[d].push(h[4 * d + g][0], h[4 * d + g][1], h[4 * d + g][2], h[4 * d + g][3]);
                return j },
            y = function(a) {
                for (var b = 0; 4 > b; b++) a[b] = E[a[b]];
                return a },
            z = function(a) {
                var b, c = a[0];
                for (b = 0; 4 > b; b++) a[b] = a[b + 1];
                return a[3] = c, a },
            A = function(a, b) {
                var c = [];
                for (i = 0; i < a.length; i += b) c[i / b] = parseInt(a.substr(i, b), 16);
                return c },
            B = function(a) {
                var b = [];
                for (i = 0; i < a.length; i++) b[a[i]] = i;
                return b },
            C = function(a, b) {
                var c, d;
                for (d = 0, c = 0; 8 > c; c++) d = 1 == (1 & b) ? d ^ a : d, a = a > 127 ? 283 ^ a << 1 : a << 1, b >>>= 1;
                return d },
            D = function(a) {
                for (var b = [], c = 0; 256 > c; c++) b[c] = C(a, c);
                return b },
            E = A("637c777bf26b6fc53001672bfed7ab76ca82c97dfa5947f0add4a2af9ca472c0b7fd9326363ff7cc34a5e5f171d8311504c723c31896059a071280e2eb27b27509832c1a1b6e5aa0523bd6b329e32f8453d100ed20fcb15b6acbbe394a4c58cfd0efaafb434d338545f9027f503c9fa851a3408f929d38f5bcb6da2110fff3d2cd0c13ec5f974417c4a77e3d645d197360814fdc222a908846eeb814de5e0bdbe0323a0a4906245cc2d3ac629195e479e7c8376d8dd54ea96c56f4ea657aae08ba78252e1ca6b4c6e8dd741f4bbd8b8a703eb5664803f60e613557b986c11d9ee1f8981169d98e949b1e87e9ce5528df8ca1890dbfe6426841992d0fb054bb16", 2),
            F = B(E),
            G = A("01020408102040801b366cd8ab4d9a2f5ebc63c697356ad4b37dfaefc591", 2),
            H = D(2),
            I = D(3),
            J = D(9),
            K = D(11),
            L = D(13),
            M = D(14),
            N = function(a, b, c) {
                var d, e = m(8),
                    f = n(k(b, c), e),
                    g = f.key,
                    h = f.iv,
                    i = [
                        [83, 97, 108, 116, 101, 100, 95, 95].concat(e)
                    ];
                return a = k(a, c), d = o(a, g, h), d = i.concat(d), Q.encode(d) },
            O = function(a, b, c) {
                var d = Q.decode(a),
                    e = d.slice(8, 16),
                    f = n(k(b, c), e),
                    g = f.key,
                    h = f.iv;
                return d = d.slice(16, d.length), a = p(d, g, h, c) },
            P = function(a) {
                function b(a, b) {
                    return a << b | a >>> 32 - b }

                function c(a, b) {
                    var c, d, e, f, g;
                    return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f }

                function d(a, b, c) {
                    return a & b | ~a & c }

                function e(a, b, c) {
                    return a & c | b & ~c }

                function f(a, b, c) {
                    return a ^ b ^ c }

                function g(a, b, c) {
                    return b ^ (a | ~c) }

                function h(a, e, f, g, h, i, j) {
                    return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) }

                function i(a, d, f, g, h, i, j) {
                    return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) }

                function j(a, d, e, g, h, i, j) {
                    return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) }

                function k(a, d, e, f, h, i, j) {
                    return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) }

                function l(a) {
                    for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = [], h = 0, i = 0; c > i;) b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a[i] << h, i++;
                    return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g }

                function m(a) {
                    var b, c, d = [];
                    for (c = 0; 3 >= c; c++) b = a >>> 8 * c & 255, d = d.concat(b);
                    return d }
                var n, o, p, q, r, s, t, u, v, w = [],
                    x = A("67452301efcdab8998badcfe10325476d76aa478e8c7b756242070dbc1bdceeef57c0faf4787c62aa8304613fd469501698098d88b44f7afffff5bb1895cd7be6b901122fd987193a679438e49b40821f61e2562c040b340265e5a51e9b6c7aad62f105d02441453d8a1e681e7d3fbc821e1cde6c33707d6f4d50d87455a14eda9e3e905fcefa3f8676f02d98d2a4c8afffa39428771f6816d9d6122fde5380ca4beea444bdecfa9f6bb4b60bebfbc70289b7ec6eaa127fad4ef308504881d05d9d4d039e6db99e51fa27cf8c4ac5665f4292244432aff97ab9423a7fc93a039655b59c38f0ccc92ffeff47d85845dd16fa87e4ffe2ce6e0a30143144e0811a1f7537e82bd3af2352ad7d2bbeb86d391", 8);
                for (w = l(a), s = x[0], t = x[1], u = x[2], v = x[3], n = 0; n < w.length; n += 16) o = s, p = t, q = u, r = v, s = h(s, t, u, v, w[n + 0], 7, x[4]), v = h(v, s, t, u, w[n + 1], 12, x[5]), u = h(u, v, s, t, w[n + 2], 17, x[6]), t = h(t, u, v, s, w[n + 3], 22, x[7]), s = h(s, t, u, v, w[n + 4], 7, x[8]), v = h(v, s, t, u, w[n + 5], 12, x[9]), u = h(u, v, s, t, w[n + 6], 17, x[10]), t = h(t, u, v, s, w[n + 7], 22, x[11]), s = h(s, t, u, v, w[n + 8], 7, x[12]), v = h(v, s, t, u, w[n + 9], 12, x[13]), u = h(u, v, s, t, w[n + 10], 17, x[14]), t = h(t, u, v, s, w[n + 11], 22, x[15]), s = h(s, t, u, v, w[n + 12], 7, x[16]), v = h(v, s, t, u, w[n + 13], 12, x[17]), u = h(u, v, s, t, w[n + 14], 17, x[18]), t = h(t, u, v, s, w[n + 15], 22, x[19]), s = i(s, t, u, v, w[n + 1], 5, x[20]), v = i(v, s, t, u, w[n + 6], 9, x[21]), u = i(u, v, s, t, w[n + 11], 14, x[22]), t = i(t, u, v, s, w[n + 0], 20, x[23]), s = i(s, t, u, v, w[n + 5], 5, x[24]), v = i(v, s, t, u, w[n + 10], 9, x[25]), u = i(u, v, s, t, w[n + 15], 14, x[26]), t = i(t, u, v, s, w[n + 4], 20, x[27]), s = i(s, t, u, v, w[n + 9], 5, x[28]), v = i(v, s, t, u, w[n + 14], 9, x[29]), u = i(u, v, s, t, w[n + 3], 14, x[30]), t = i(t, u, v, s, w[n + 8], 20, x[31]), s = i(s, t, u, v, w[n + 13], 5, x[32]), v = i(v, s, t, u, w[n + 2], 9, x[33]), u = i(u, v, s, t, w[n + 7], 14, x[34]), t = i(t, u, v, s, w[n + 12], 20, x[35]), s = j(s, t, u, v, w[n + 5], 4, x[36]), v = j(v, s, t, u, w[n + 8], 11, x[37]), u = j(u, v, s, t, w[n + 11], 16, x[38]), t = j(t, u, v, s, w[n + 14], 23, x[39]), s = j(s, t, u, v, w[n + 1], 4, x[40]), v = j(v, s, t, u, w[n + 4], 11, x[41]), u = j(u, v, s, t, w[n + 7], 16, x[42]), t = j(t, u, v, s, w[n + 10], 23, x[43]), s = j(s, t, u, v, w[n + 13], 4, x[44]), v = j(v, s, t, u, w[n + 0], 11, x[45]), u = j(u, v, s, t, w[n + 3], 16, x[46]), t = j(t, u, v, s, w[n + 6], 23, x[47]), s = j(s, t, u, v, w[n + 9], 4, x[48]), v = j(v, s, t, u, w[n + 12], 11, x[49]), u = j(u, v, s, t, w[n + 15], 16, x[50]), t = j(t, u, v, s, w[n + 2], 23, x[51]), s = k(s, t, u, v, w[n + 0], 6, x[52]), v = k(v, s, t, u, w[n + 7], 10, x[53]), u = k(u, v, s, t, w[n + 14], 15, x[54]), t = k(t, u, v, s, w[n + 5], 21, x[55]), s = k(s, t, u, v, w[n + 12], 6, x[56]), v = k(v, s, t, u, w[n + 3], 10, x[57]), u = k(u, v, s, t, w[n + 10], 15, x[58]), t = k(t, u, v, s, w[n + 1], 21, x[59]), s = k(s, t, u, v, w[n + 8], 6, x[60]), v = k(v, s, t, u, w[n + 15], 10, x[61]), u = k(u, v, s, t, w[n + 6], 15, x[62]), t = k(t, u, v, s, w[n + 13], 21, x[63]), s = k(s, t, u, v, w[n + 4], 6, x[64]), v = k(v, s, t, u, w[n + 11], 10, x[65]), u = k(u, v, s, t, w[n + 2], 15, x[66]), t = k(t, u, v, s, w[n + 9], 21, x[67]), s = c(s, o), t = c(t, p), u = c(u, q), v = c(v, r);
                return m(s).concat(m(t), m(u), m(v)) },
            Q = function() {
                var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                    b = a.split(""),
                    c = function(a, c) {
                        var d, e, f = [],
                            g = "";
                        Math.floor(16 * a.length / 3);
                        for (d = 0; d < 16 * a.length; d++) f.push(a[Math.floor(d / 16)][d % 16]);
                        for (d = 0; d < f.length; d += 3) g += b[f[d] >> 2], g += b[(3 & f[d]) << 4 | f[d + 1] >> 4], g += void 0 !== f[d + 1] ? b[(15 & f[d + 1]) << 2 | f[d + 2] >> 6] : "=", g += void 0 !== f[d + 2] ? b[63 & f[d + 2]] : "=";
                        for (e = g.slice(0, 64), d = 1; d < Math.ceil(g.length / 64); d++) e += g.slice(64 * d, 64 * d + 64) + (Math.ceil(g.length / 64) == d + 1 ? "" : "\n");
                        return e },
                    d = function(b) {
                        b = b.replace(/\n/g, "");
                        var c, d = [],
                            e = [],
                            f = [];
                        for (c = 0; c < b.length; c += 4) e[0] = a.indexOf(b.charAt(c)), e[1] = a.indexOf(b.charAt(c + 1)),
                            e[2] = a.indexOf(b.charAt(c + 2)), e[3] = a.indexOf(b.charAt(c + 3)), f[0] = e[0] << 2 | e[1] >> 4, f[1] = (15 & e[1]) << 4 | e[2] >> 2, f[2] = (3 & e[2]) << 6 | e[3], d.push(f[0], f[1], f[2]);
                        return d = d.slice(0, d.length - d.length % 16)
                    };
                return "function" == typeof Array.indexOf && (a = b), { encode: c, decode: d }
            }();
        return { size: l, h2a: j, expandKey: x, encryptBlock: q, decryptBlock: r, Decrypt: c, s2a: k, rawEncrypt: o, rawDecrypt: p, dec: O, openSSLKey: n, a2h: h, enc: N, Hash: { MD5: P }, Base64: Q }
    }();
window.PUBNUB || function() {
        function a(a, b) {
            var c = CryptoJS.HmacSHA256(a, b);
            return c.toString(CryptoJS.enc.Base64) }

        function b(a) {
            return document.getElementById(a) }

        function c(a) { console.error(a) }

        function d(a, b) {
            var c = [];
            return each(a.split(/\s+/), function(a) { each((b || document).getElementsByTagName(a), function(a) { c.push(a) }) }), c }

        function e(a, b, c) { each(a.split(","), function(a) {
                var d = function(a) { a || (a = window.event), c(a) || (a.cancelBubble = !0, a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation()) };
                b.addEventListener ? b.addEventListener(a, d, !1) : b.attachEvent ? b.attachEvent("on" + a, d) : b["on" + a] = d }) }

        function f() {
            return d("head")[0] }

        function g(a, b, c) {
            return c ? void a.setAttribute(b, c) : a && a.getAttribute && a.getAttribute(b) }

        function h(a, b) {
            for (var c in b)
                if (b.hasOwnProperty(c)) try { a.style[c] = b[c] + ("|width|height|top|left|".indexOf(c) > 0 && "number" == typeof b[c] ? "px" : "") } catch (d) {} }

        function i(a) {
            return document.createElement(a) }

        function j() {
            return s || n() ? 0 : unique() }

        function k(a) {
            if (s || n()) return l(a);
            var c = i("script"),
                d = a.callback,
                e = unique(),
                h = 0,
                j = a.timeout || DEF_TIMEOUT,
                k = timeout(function() { t(1, { message: "timeout" }) }, j),
                m = a.fail || function() {},
                o = a.data || {},
                q = a.success || function() {},
                r = function() { f().appendChild(c) },
                t = function(a, d) { h || (h = 1, c.onerror = null, clearTimeout(k), a || !d || q(d), timeout(function() { a && m();
                        var c = b(e),
                            d = c && c.parentNode;
                        d && d.removeChild(c) }, SECOND)) };
            return window[d] = function(a) { t(0, a) }, a.blocking || (c[p] = p), c.onerror = function() { t(1) }, c.src = build_url(a.url, o), g(c, "id", e), r(), t }

        function l(a) {
            var b, c, d = function() {
                    if (!f) { f = 1, clearTimeout(h);
                        try { c = JSON.parse(b.responseText) } catch (a) {
                            return o(1) }
                        e = 1, l(c) } },
                e = 0,
                f = 0,
                g = a.timeout || DEF_TIMEOUT,
                h = timeout(function() { o(1, { message: "timeout" }) }, g),
                i = a.fail || function() {},
                j = a.data || {},
                l = a.success || function() {},
                m = !a.blocking,
                o = function(a, c) { e || (e = 1, clearTimeout(h), b && (b.onerror = b.onload = null, b.abort && b.abort(), b = null), a && i(c)) };
            try { b = n() || window.XDomainRequest && new XDomainRequest || new XMLHttpRequest, b.onerror = b.onabort = function() { o(1, b.responseText || { error: "Network Connection Error" }) }, b.onload = b.onloadend = d, b.onreadystatechange = function() {
                    if (b && 4 == b.readyState) switch (b.status) {
                        case 401:
                        case 402:
                        case 403:
                            try { c = JSON.parse(b.responseText), o(1, c) } catch (a) {
                                return o(1, b.responseText) } } };
                var p = build_url(a.url, j);
                b.open("GET", p, m), m && (b.timeout = g), b.send() } catch (q) {
                return o(0), s = 0, k(a) }
            return o }

        function m() {
            return "onLine" in navigator ? navigator.onLine : 1 }

        function n() {
            if (!y || !y.get) return 0;
            var a = { id: n.id++, send: function() {}, abort: function() { a.id = {} }, open: function(b, c) { n[a.id] = a, y.get(a.id, c) } };
            return a }
        var o = "https://pubnub.a.ssl.fastly.net/pubnub.swf",
            p = "async",
            q = navigator.userAgent,
            r = "PubNub-JS-Web/3.7.2",
            s = -1 == q.indexOf("MSIE 6");
        window.console || (window.console = window.console || {}), console.log || (console.log = console.error = (window.opera || {}).postError || function() {});
        var t = function() {
                var a = {},
                    b = !1;
                try { b = window.localStorage } catch (c) {}
                var d = function(a) {
                        return -1 == document.cookie.indexOf(a) ? null : ((document.cookie || "").match(RegExp(a + "=([^;]+)")) || [])[1] || null },
                    e = function(a, b) { document.cookie = a + "=" + b + "; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/" },
                    f = function() {
                        try {
                            return e("pnctest", "1"), "1" === d("pnctest") } catch (a) {
                            return !1 } }();
                return { get: function(c) {
                        try {
                            return b ? b.getItem(c) : f ? d(c) : a[c] } catch (e) {
                            return a[c] } }, set: function(c, d) {
                        try {
                            if (b) return b.setItem(c, d) && 0;
                            f && e(c, d), a[c] = d } catch (g) { a[c] = d } } } }(),
            u = { list: {}, unbind: function(a) { u.list[a] = [] }, bind: function(a, b) {
                    (u.list[a] = u.list[a] || []).push(b) }, fire: function(a, b) { each(u.list[a] || [], function(a) { a(b) }) } },
            v = b("pubnub") || 0,
            w = function(l) { l.jsonp && (s = 0);
                var n = l.subscribe_key || "",
                    o = ((+l.keepalive || DEF_KEEPALIVE) * SECOND, l.uuid || t.get(n + "uuid") || "", l.leave_on_unload || 0);
                l.xdr = k, l.db = t, l.error = l.error || c, l._is_online = m, l.jsonp_cb = j, l.hmac_SHA256 = a, l.crypto_obj = crypto_obj(), l.params = { pnsdk: r };
                var p = function(a) {
                        return w(a) },
                    q = PN_API(l);
                for (var v in q) q.hasOwnProperty(v) && (p[v] = q[v]);
                return p.css = h, p.$ = b, p.create = i, p.bind = e, p.head = f, p.search = d, p.attr = g, p.events = u, p.init = p, p.secure = p, e("beforeunload", window, function() {
                    return o && p["each-channel"](function(a) { p.LEAVE(a.name, 0) }), !0 }), l.notest ? p : (e("offline", window, p.offline), e("offline", document, p.offline), p) };
        w.init = w, w.secure = w, "complete" === document.readyState ? timeout(ready, 0) : e("load", window, function() { timeout(ready, 0) });
        var x = v || {};
        PUBNUB = w({ notest: 1, publish_key: g(x, "pub-key"), subscribe_key: g(x, "sub-key"), ssl: !document.location.href.indexOf("https") || "on" == g(x, "ssl"), origin: g(x, "origin"), uuid: g(x, "uuid") }), window.jQuery && (window.jQuery.PUBNUB = w), "undefined" != typeof module && (module.exports = PUBNUB) && ready();
        var y = b("pubnubs") || 0;
        v && (h(v, { position: "absolute", top: -SECOND }), ("opera" in window || g(v, "flash")) && (v.innerHTML = "<object id=pubnubs data=" + o + "><param name=movie value=" + o + "><param name=allowscriptaccess value=always></object>"), PUBNUB.rdx = function(a, b) {
            return b ? (n[a].responseText = unescape(b), void n[a].onload()) : n[a].onerror() }, n.id = SECOND) }(),
    function() {
        var a = PUBNUB.ws = function(b, c) {
            if (!(this instanceof a)) return new a(b, c);
            var d = this,
                b = d.url = b || "",
                e = (d.protocol = c || "Sec-WebSocket-Protocol", b.split("/")),
                f = { ssl: "wss:" === e[0], origin: e[2], publish_key: e[3], subscribe_key: e[4], channel: e[5] };
            return d.CONNECTING = 0, d.OPEN = 1, d.CLOSING = 2, d.CLOSED = 3, d.CLOSE_NORMAL = 1e3, d.CLOSE_GOING_AWAY = 1001, d.CLOSE_PROTOCOL_ERROR = 1002, d.CLOSE_UNSUPPORTED = 1003, d.CLOSE_TOO_LARGE = 1004, d.CLOSE_NO_STATUS = 1005, d.CLOSE_ABNORMAL = 1006, d.onclose = d.onerror = d.onmessage = d.onopen = d.onsend = function() {}, d.binaryType = "", d.extensions = "", d.bufferedAmount = 0, d.trasnmitting = !1, d.buffer = [], d.readyState = d.CONNECTING, b ? (d.pubnub = PUBNUB.init(f), d.pubnub.setup = f, d.setup = f, void d.pubnub.subscribe({ restore: !1, channel: f.channel, disconnect: d.onerror, reconnect: d.onopen, error: function() { d.onclose({ code: d.CLOSE_ABNORMAL, reason: "Missing URL", wasClean: !1 }) }, callback: function(a) { d.onmessage({ data: a }) }, connect: function() { d.readyState = d.OPEN, d.onopen() } })) : (d.readyState = d.CLOSED, d.onclose({ code: d.CLOSE_ABNORMAL, reason: "Missing URL", wasClean: !0 }), d) };
        a.prototype.send = function(a) {
            var b = this;
            b.pubnub.publish({ channel: b.pubnub.setup.channel, message: a, callback: function(a) { b.onsend({ data: a }) } }) }, a.prototype.close = function() {
            var a = this;
            a.pubnub.unsubscribe({ channel: a.pubnub.setup.channel }), a.readyState = a.CLOSED, a.onclose({}) } }();
var CryptoJS = CryptoJS || function(a, b) {
    var c = {},
        d = c.lib = {},
        e = function() {},
        f = d.Base = { extend: function(a) { e.prototype = this;
                var b = new e;
                return a && b.mixIn(a), b.hasOwnProperty("init") || (b.init = function() { b.$super.init.apply(this, arguments) }), b.init.prototype = b, b.$super = this, b }, create: function() {
                var a = this.extend();
                return a.init.apply(a, arguments), a }, init: function() {}, mixIn: function(a) {
                for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function() {
                return this.init.prototype.extend(this) } },
        g = d.WordArray = f.extend({ init: function(a, c) { a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length }, toString: function(a) {
                return (a || i).stringify(this) }, concat: function(a) {
                var b = this.words,
                    c = a.words,
                    d = this.sigBytes;
                if (a = a.sigBytes, this.clamp(), d % 4)
                    for (var e = 0; a > e; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                else if (65535 < c.length)
                    for (e = 0; a > e; e += 4) b[d + e >>> 2] = c[e >>> 2];
                else b.push.apply(b, c);
                return this.sigBytes += a, this }, clamp: function() {
                var b = this.words,
                    c = this.sigBytes;
                b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4) }, clone: function() {
                var a = f.clone.call(this);
                return a.words = this.words.slice(0), a }, random: function(b) {
                for (var c = [], d = 0; b > d; d += 4) c.push(4294967296 * a.random() | 0);
                return new g.init(c, b) } }),
        h = c.enc = {},
        i = h.Hex = { stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++) {
                    var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                    c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16)) }
                return c.join("") }, parse: function(a) {
                for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                return new g.init(c, b / 2) } },
        j = h.Latin1 = { stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                return c.join("") }, parse: function(a) {
                for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                return new g.init(c, b) } },
        k = h.Utf8 = { stringify: function(a) {
                try {
                    return decodeURIComponent(escape(j.stringify(a))) } catch (b) {
                    throw Error("Malformed UTF-8 data") } }, parse: function(a) {
                return j.parse(unescape(encodeURIComponent(a))) } },
        l = d.BufferedBlockAlgorithm = f.extend({ reset: function() { this._data = new g.init, this._nDataBytes = 0 }, _append: function(a) { "string" == typeof a && (a = k.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes }, _process: function(b) {
                var c = this._data,
                    d = c.words,
                    e = c.sigBytes,
                    f = this.blockSize,
                    h = e / (4 * f),
                    h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                if (b = h * f, e = a.min(4 * b, e), b) {
                    for (var i = 0; b > i; i += f) this._doProcessBlock(d, i);
                    i = d.splice(0, b), c.sigBytes -= e }
                return new g.init(i, e) }, clone: function() {
                var a = f.clone.call(this);
                return a._data = this._data.clone(), a }, _minBufferSize: 0 });
    d.Hasher = l.extend({ cfg: f.extend(), init: function(a) { this.cfg = this.cfg.extend(a), this.reset() }, reset: function() { l.reset.call(this), this._doReset() }, update: function(a) {
            return this._append(a), this._process(), this }, finalize: function(a) {
            return a && this._append(a), this._doFinalize() }, blockSize: 16, _createHelper: function(a) {
            return function(b, c) {
                return new a.init(c).finalize(b) } }, _createHmacHelper: function(a) {
            return function(b, c) {
                return new m.HMAC.init(a, c).finalize(b) } } });
    var m = c.algo = {};
    return c }(Math);
! function(a) {
    for (var b = CryptoJS, c = b.lib, d = c.WordArray, e = c.Hasher, c = b.algo, f = [], g = [], h = function(a) {
            return 4294967296 * (a - (0 | a)) | 0 }, i = 2, j = 0; 64 > j;) {
        var k;
        a: { k = i;
            for (var l = a.sqrt(k), m = 2; l >= m; m++)
                if (!(k % m)) { k = !1;
                    break a }
            k = !0 }
        k && (8 > j && (f[j] = h(a.pow(i, .5))), g[j] = h(a.pow(i, 1 / 3)), j++), i++ }
    var n = [],
        c = c.SHA256 = e.extend({ _doReset: function() { this._hash = new d.init(f.slice(0)) }, _doProcessBlock: function(a, b) {
                for (var c = this._hash.words, d = c[0], e = c[1], f = c[2], h = c[3], i = c[4], j = c[5], k = c[6], l = c[7], m = 0; 64 > m; m++) {
                    if (16 > m) n[m] = 0 | a[b + m];
                    else {
                        var o = n[m - 15],
                            p = n[m - 2];
                        n[m] = ((o << 25 | o >>> 7) ^ (o << 14 | o >>> 18) ^ o >>> 3) + n[m - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + n[m - 16] }
                    o = l + ((i << 26 | i >>> 6) ^ (i << 21 | i >>> 11) ^ (i << 7 | i >>> 25)) + (i & j ^ ~i & k) + g[m] + n[m], p = ((d << 30 | d >>> 2) ^ (d << 19 | d >>> 13) ^ (d << 10 | d >>> 22)) + (d & e ^ d & f ^ e & f), l = k, k = j, j = i, i = h + o | 0, h = f, f = e, e = d, d = o + p | 0 }
                c[0] = c[0] + d | 0, c[1] = c[1] + e | 0, c[2] = c[2] + f | 0, c[3] = c[3] + h | 0, c[4] = c[4] + i | 0, c[5] = c[5] + j | 0, c[6] = c[6] + k | 0, c[7] = c[7] + l | 0 }, _doFinalize: function() {
                var b = this._data,
                    c = b.words,
                    d = 8 * this._nDataBytes,
                    e = 8 * b.sigBytes;
                return c[e >>> 5] |= 128 << 24 - e % 32, c[(e + 64 >>> 9 << 4) + 14] = a.floor(d / 4294967296), c[(e + 64 >>> 9 << 4) + 15] = d, b.sigBytes = 4 * c.length, this._process(), this._hash }, clone: function() {
                var a = e.clone.call(this);
                return a._hash = this._hash.clone(), a } });
    b.SHA256 = e._createHelper(c), b.HmacSHA256 = e._createHmacHelper(c) }(Math),
function() {
    var a = CryptoJS,
        b = a.enc.Utf8;
    a.algo.HMAC = a.lib.Base.extend({ init: function(a, c) { a = this._hasher = new a.init, "string" == typeof c && (c = b.parse(c));
            var d = a.blockSize,
                e = 4 * d;
            c.sigBytes > e && (c = a.finalize(c)), c.clamp();
            for (var f = this._oKey = c.clone(), g = this._iKey = c.clone(), h = f.words, i = g.words, j = 0; d > j; j++) h[j] ^= 1549556828, i[j] ^= 909522486;
            f.sigBytes = g.sigBytes = e, this.reset() }, reset: function() {
            var a = this._hasher;
            a.reset(), a.update(this._iKey) }, update: function(a) {
            return this._hasher.update(a), this }, finalize: function(a) {
            var b = this._hasher;
            return a = b.finalize(a), b.reset(), b.finalize(this._oKey.clone().concat(a)) } }) }(),
function() {
    var a = CryptoJS,
        b = a.lib.WordArray;
    a.enc.Base64 = { stringify: function(a) {
            var b = a.words,
                c = a.sigBytes,
                d = this._map;
            a.clamp(), a = [];
            for (var e = 0; c > e; e += 3)
                for (var f = (b[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 16 | (b[e + 1 >>> 2] >>> 24 - 8 * ((e + 1) % 4) & 255) << 8 | b[e + 2 >>> 2] >>> 24 - 8 * ((e + 2) % 4) & 255, g = 0; 4 > g && c > e + .75 * g; g++) a.push(d.charAt(f >>> 6 * (3 - g) & 63));
            if (b = d.charAt(64))
                for (; a.length % 4;) a.push(b);
            return a.join("") }, parse: function(a) {
            var c = a.length,
                d = this._map,
                e = d.charAt(64);
            e && (e = a.indexOf(e), -1 != e && (c = e));
            for (var e = [], f = 0, g = 0; c > g; g++)
                if (g % 4) {
                    var h = d.indexOf(a.charAt(g - 1)) << 2 * (g % 4),
                        i = d.indexOf(a.charAt(g)) >>> 6 - 2 * (g % 4);
                    e[f >>> 2] |= (h | i) << 24 - 8 * (f % 4), f++ }
            return b.create(e, f) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } }(),
function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.SinchClient = a() } }(function() {
    var a;
    return function b(a, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j }
                var k = c[g] = { exports: {} };
                a[g][0].call(k.exports, function(b) {
                    var c = a[g][1][b];
                    return e(c ? c : b) }, k, k.exports, b, a, c, d) }
            return c[g].exports }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e }({
        1: [function(a, b, c) { VERSION = ["1.4.4-1-g8579142", "1.4.4", "1", "8579142", null], c.version = VERSION }, {}],
        2: [function(a, b, c) {
            (function(a) {! function() { "use strict";

                    function c(b) {
                        return new a(b, "base64").toString("binary") }
                    b.exports = c }() }).call(this, a("buffer").Buffer) }, { buffer: 5 }],
        3: [function(a, b, c) {
            var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";! function(a) { "use strict";

                function b(a) {
                    var b = a.charCodeAt(0);
                    return b === g || b === l ? 62 : b === h || b === m ? 63 : i > b ? -1 : i + 10 > b ? b - i + 26 + 26 : k + 26 > b ? b - k : j + 26 > b ? b - j + 26 : void 0 }

                function c(a) {
                    function c(a) { j[l++] = a }
                    var d, e, g, h, i, j;
                    if (a.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                    var k = a.length;
                    i = "=" === a.charAt(k - 2) ? 2 : "=" === a.charAt(k - 1) ? 1 : 0, j = new f(3 * a.length / 4 - i), g = i > 0 ? a.length - 4 : a.length;
                    var l = 0;
                    for (d = 0, e = 0; g > d; d += 4, e += 3) h = b(a.charAt(d)) << 18 | b(a.charAt(d + 1)) << 12 | b(a.charAt(d + 2)) << 6 | b(a.charAt(d + 3)), c((16711680 & h) >> 16), c((65280 & h) >> 8), c(255 & h);
                    return 2 === i ? (h = b(a.charAt(d)) << 2 | b(a.charAt(d + 1)) >> 4, c(255 & h)) : 1 === i && (h = b(a.charAt(d)) << 10 | b(a.charAt(d + 1)) << 4 | b(a.charAt(d + 2)) >> 2, c(h >> 8 & 255), c(255 & h)), j }

                function e(a) {
                    function b(a) {
                        return d.charAt(a) }

                    function c(a) {
                        return b(a >> 18 & 63) + b(a >> 12 & 63) + b(a >> 6 & 63) + b(63 & a) }
                    var e, f, g, h = a.length % 3,
                        i = "";
                    for (e = 0, g = a.length - h; g > e; e += 3) f = (a[e] << 16) + (a[e + 1] << 8) + a[e + 2], i += c(f);
                    switch (h) {
                        case 1:
                            f = a[a.length - 1], i += b(f >> 2), i += b(f << 4 & 63), i += "==";
                            break;
                        case 2:
                            f = (a[a.length - 2] << 8) + a[a.length - 1], i += b(f >> 10), i += b(f >> 4 & 63), i += b(f << 2 & 63), i += "=" }
                    return i }
                var f = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                    g = "+".charCodeAt(0),
                    h = "/".charCodeAt(0),
                    i = "0".charCodeAt(0),
                    j = "a".charCodeAt(0),
                    k = "A".charCodeAt(0),
                    l = "-".charCodeAt(0),
                    m = "_".charCodeAt(0);
                a.toByteArray = c, a.fromByteArray = e }("undefined" == typeof c ? this.base64js = {} : c) }, {}],
        4: [function(a, b, c) {
            (function(a) {! function() { "use strict";

                    function c(b) {
                        var c;
                        return c = b instanceof a ? b : new a(b.toString(), "binary"), c.toString("base64") }
                    b.exports = c }() }).call(this, a("buffer").Buffer) }, { buffer: 5 }],
        5: [function(a, b, c) {
            (function(b) {
                "use strict";

                function d() {
                    function a() {}
                    try {
                        var b = new Uint8Array(1);
                        return b.foo = function() {
                            return 42 }, b.constructor = a, 42 === b.foo() && b.constructor === a && "function" == typeof b.subarray && 0 === b.subarray(1, 1).byteLength } catch (c) {
                        return !1 } }

                function e() {
                    return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823 }

                function f(a) {
                    return this instanceof f ? (f.TYPED_ARRAY_SUPPORT || (this.length = 0, this.parent = void 0), "number" == typeof a ? g(this, a) : "string" == typeof a ? h(this, a, arguments.length > 1 ? arguments[1] : "utf8") : i(this, a)) : arguments.length > 1 ? new f(a, arguments[1]) : new f(a) }

                function g(a, b) {
                    if (a = p(a, 0 > b ? 0 : 0 | q(b)), !f.TYPED_ARRAY_SUPPORT)
                        for (var c = 0; b > c; c++) a[c] = 0;
                    return a }

                function h(a, b, c) {
                    ("string" != typeof c || "" === c) && (c = "utf8");
                    var d = 0 | s(b, c);
                    return a = p(a, d), a.write(b, c), a }

                function i(a, b) {
                    if (f.isBuffer(b)) return j(a, b);
                    if (Y(b)) return k(a, b);
                    if (null == b) throw new TypeError("must start with number, buffer, array or string");
                    if ("undefined" != typeof ArrayBuffer) {
                        if (b.buffer instanceof ArrayBuffer) return l(a, b);
                        if (b instanceof ArrayBuffer) return m(a, b) }
                    return b.length ? n(a, b) : o(a, b) }

                function j(a, b) {
                    var c = 0 | q(b.length);
                    return a = p(a, c), b.copy(a, 0, 0, c), a }

                function k(a, b) {
                    var c = 0 | q(b.length);
                    a = p(a, c);
                    for (var d = 0; c > d; d += 1) a[d] = 255 & b[d];
                    return a }

                function l(a, b) {
                    var c = 0 | q(b.length);
                    a = p(a, c);
                    for (var d = 0; c > d; d += 1) a[d] = 255 & b[d];
                    return a }

                function m(a, b) {
                    return f.TYPED_ARRAY_SUPPORT ? (b.byteLength, a = f._augment(new Uint8Array(b))) : a = l(a, new Uint8Array(b)), a }

                function n(a, b) {
                    var c = 0 | q(b.length);
                    a = p(a, c);
                    for (var d = 0; c > d; d += 1) a[d] = 255 & b[d];
                    return a }

                function o(a, b) {
                    var c, d = 0; "Buffer" === b.type && Y(b.data) && (c = b.data, d = 0 | q(c.length)), a = p(a, d);
                    for (var e = 0; d > e; e += 1) a[e] = 255 & c[e];
                    return a }

                function p(a, b) { f.TYPED_ARRAY_SUPPORT ? (a = f._augment(new Uint8Array(b)), a.__proto__ = f.prototype) : (a.length = b, a._isBuffer = !0);
                    var c = 0 !== b && b <= f.poolSize >>> 1;
                    return c && (a.parent = Z), a }

                function q(a) {
                    if (a >= e()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + e().toString(16) + " bytes");
                    return 0 | a }

                function r(a, b) {
                    if (!(this instanceof r)) return new r(a, b);
                    var c = new f(a, b);
                    return delete c.parent, c }

                function s(a, b) { "string" != typeof a && (a = "" + a);
                    var c = a.length;
                    if (0 === c) return 0;
                    for (var d = !1;;) switch (b) {
                        case "ascii":
                        case "binary":
                        case "raw":
                        case "raws":
                            return c;
                        case "utf8":
                        case "utf-8":
                            return R(a).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * c;
                        case "hex":
                            return c >>> 1;
                        case "base64":
                            return U(a).length;
                        default:
                            if (d) return R(a).length;
                            b = ("" + b).toLowerCase(), d = !0 } }

                function t(a, b, c) {
                    var d = !1;
                    if (b = 0 | b, c = void 0 === c || c === 1 / 0 ? this.length : 0 | c, a || (a = "utf8"), 0 > b && (b = 0), c > this.length && (c = this.length), b >= c) return "";
                    for (;;) switch (a) {
                        case "hex":
                            return F(this, b, c);
                        case "utf8":
                        case "utf-8":
                            return B(this, b, c);
                        case "ascii":
                            return D(this, b, c);
                        case "binary":
                            return E(this, b, c);
                        case "base64":
                            return A(this, b, c);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return G(this, b, c);
                        default:
                            if (d) throw new TypeError("Unknown encoding: " + a);
                            a = (a + "").toLowerCase(), d = !0 } }

                function u(a, b, c, d) { c = Number(c) || 0;
                    var e = a.length - c;
                    d ? (d = Number(d), d > e && (d = e)) : d = e;
                    var f = b.length;
                    if (f % 2 !== 0) throw new Error("Invalid hex string");
                    d > f / 2 && (d = f / 2);
                    for (var g = 0; d > g; g++) {
                        var h = parseInt(b.substr(2 * g, 2), 16);
                        if (isNaN(h)) throw new Error("Invalid hex string");
                        a[c + g] = h }
                    return g }

                function v(a, b, c, d) {
                    return V(R(b, a.length - c), a, c, d) }

                function w(a, b, c, d) {
                    return V(S(b), a, c, d) }

                function x(a, b, c, d) {
                    return w(a, b, c, d) }

                function y(a, b, c, d) {
                    return V(U(b), a, c, d) }

                function z(a, b, c, d) {
                    return V(T(b, a.length - c), a, c, d) }

                function A(a, b, c) {
                    return 0 === b && c === a.length ? W.fromByteArray(a) : W.fromByteArray(a.slice(b, c)) }

                function B(a, b, c) { c = Math.min(a.length, c);
                    for (var d = [], e = b; c > e;) {
                        var f = a[e],
                            g = null,
                            h = f > 239 ? 4 : f > 223 ? 3 : f > 191 ? 2 : 1;
                        if (c >= e + h) {
                            var i, j, k, l;
                            switch (h) {
                                case 1:
                                    128 > f && (g = f);
                                    break;
                                case 2:
                                    i = a[e + 1], 128 === (192 & i) && (l = (31 & f) << 6 | 63 & i, l > 127 && (g = l));
                                    break;
                                case 3:
                                    i = a[e + 1], j = a[e + 2], 128 === (192 & i) && 128 === (192 & j) && (l = (15 & f) << 12 | (63 & i) << 6 | 63 & j, l > 2047 && (55296 > l || l > 57343) && (g = l));
                                    break;
                                case 4:
                                    i = a[e + 1], j = a[e + 2], k = a[e + 3], 128 === (192 & i) && 128 === (192 & j) && 128 === (192 & k) && (l = (15 & f) << 18 | (63 & i) << 12 | (63 & j) << 6 | 63 & k, l > 65535 && 1114112 > l && (g = l)) } }
                        null === g ? (g = 65533, h = 1) : g > 65535 && (g -= 65536, d.push(g >>> 10 & 1023 | 55296), g = 56320 | 1023 & g), d.push(g), e += h }
                    return C(d) }

                function C(a) {
                    var b = a.length;
                    if ($ >= b) return String.fromCharCode.apply(String, a);
                    for (var c = "", d = 0; b > d;) c += String.fromCharCode.apply(String, a.slice(d, d += $));
                    return c }

                function D(a, b, c) {
                    var d = "";
                    c = Math.min(a.length, c);
                    for (var e = b; c > e; e++) d += String.fromCharCode(127 & a[e]);
                    return d }

                function E(a, b, c) {
                    var d = "";
                    c = Math.min(a.length, c);
                    for (var e = b; c > e; e++) d += String.fromCharCode(a[e]);
                    return d }

                function F(a, b, c) {
                    var d = a.length;
                    (!b || 0 > b) && (b = 0), (!c || 0 > c || c > d) && (c = d);
                    for (var e = "", f = b; c > f; f++) e += Q(a[f]);
                    return e }

                function G(a, b, c) {
                    for (var d = a.slice(b, c), e = "", f = 0; f < d.length; f += 2) e += String.fromCharCode(d[f] + 256 * d[f + 1]);
                    return e }

                function H(a, b, c) {
                    if (a % 1 !== 0 || 0 > a) throw new RangeError("offset is not uint");
                    if (a + b > c) throw new RangeError("Trying to access beyond buffer length") }

                function I(a, b, c, d, e, g) {
                    if (!f.isBuffer(a)) throw new TypeError("buffer must be a Buffer instance");
                    if (b > e || g > b) throw new RangeError("value is out of bounds");
                    if (c + d > a.length) throw new RangeError("index out of range") }

                function J(a, b, c, d) { 0 > b && (b = 65535 + b + 1);
                    for (var e = 0, f = Math.min(a.length - c, 2); f > e; e++) a[c + e] = (b & 255 << 8 * (d ? e : 1 - e)) >>> 8 * (d ? e : 1 - e) }

                function K(a, b, c, d) { 0 > b && (b = 4294967295 + b + 1);
                    for (var e = 0, f = Math.min(a.length - c, 4); f > e; e++) a[c + e] = b >>> 8 * (d ? e : 3 - e) & 255 }

                function L(a, b, c, d, e, f) {
                    if (b > e || f > b) throw new RangeError("value is out of bounds");
                    if (c + d > a.length) throw new RangeError("index out of range");
                    if (0 > c) throw new RangeError("index out of range") }

                function M(a, b, c, d, e) {
                    return e || L(a, b, c, 4, 3.4028234663852886e38, -3.4028234663852886e38), X.write(a, b, c, d, 23, 4), c + 4 }

                function N(a, b, c, d, e) {
                    return e || L(a, b, c, 8, 1.7976931348623157e308, -1.7976931348623157e308), X.write(a, b, c, d, 52, 8), c + 8 }

                function O(a) {
                    if (a = P(a).replace(aa, ""), a.length < 2) return "";
                    for (; a.length % 4 !== 0;) a += "=";
                    return a }

                function P(a) {
                    return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "") }

                function Q(a) {
                    return 16 > a ? "0" + a.toString(16) : a.toString(16) }

                function R(a, b) { b = b || 1 / 0;
                    for (var c, d = a.length, e = null, f = [], g = 0; d > g; g++) {
                        if (c = a.charCodeAt(g), c > 55295 && 57344 > c) {
                            if (!e) {
                                if (c > 56319) {
                                    (b -= 3) > -1 && f.push(239, 191, 189);
                                    continue }
                                if (g + 1 === d) {
                                    (b -= 3) > -1 && f.push(239, 191, 189);
                                    continue }
                                e = c;
                                continue }
                            if (56320 > c) {
                                (b -= 3) > -1 && f.push(239, 191, 189), e = c;
                                continue }
                            c = (e - 55296 << 10 | c - 56320) + 65536 } else e && (b -= 3) > -1 && f.push(239, 191, 189);
                        if (e = null, 128 > c) {
                            if ((b -= 1) < 0) break;
                            f.push(c) } else if (2048 > c) {
                            if ((b -= 2) < 0) break;
                            f.push(c >> 6 | 192, 63 & c | 128) } else if (65536 > c) {
                            if ((b -= 3) < 0) break;
                            f.push(c >> 12 | 224, c >> 6 & 63 | 128, 63 & c | 128) } else {
                            if (!(1114112 > c)) throw new Error("Invalid code point");
                            if ((b -= 4) < 0) break;
                            f.push(c >> 18 | 240, c >> 12 & 63 | 128, c >> 6 & 63 | 128, 63 & c | 128) } }
                    return f }

                function S(a) {
                    for (var b = [], c = 0; c < a.length; c++) b.push(255 & a.charCodeAt(c));
                    return b }

                function T(a, b) {
                    for (var c, d, e, f = [], g = 0; g < a.length && !((b -= 2) < 0); g++) c = a.charCodeAt(g), d = c >> 8, e = c % 256, f.push(e), f.push(d);
                    return f }

                function U(a) {
                    return W.toByteArray(O(a)) }

                function V(a, b, c, d) {
                    for (var e = 0; d > e && !(e + c >= b.length || e >= a.length); e++) b[e + c] = a[e];
                    return e }
                var W = a("base64-js"),
                    X = a("ieee754"),
                    Y = a("isarray");
                c.Buffer = f, c.SlowBuffer = r, c.INSPECT_MAX_BYTES = 50, f.poolSize = 8192;
                var Z = {};
                f.TYPED_ARRAY_SUPPORT = void 0 !== b.TYPED_ARRAY_SUPPORT ? b.TYPED_ARRAY_SUPPORT : d(), f.TYPED_ARRAY_SUPPORT ? (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array) : (f.prototype.length = void 0, f.prototype.parent = void 0), f.isBuffer = function(a) {
                    return !(null == a || !a._isBuffer) }, f.compare = function(a, b) {
                    if (!f.isBuffer(a) || !f.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
                    if (a === b) return 0;
                    for (var c = a.length, d = b.length, e = 0, g = Math.min(c, d); g > e && a[e] === b[e];) ++e;
                    return e !== g && (c = a[e], d = b[e]), d > c ? -1 : c > d ? 1 : 0 }, f.isEncoding = function(a) {
                    switch (String(a).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "binary":
                        case "base64":
                        case "raw":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1 } }, f.concat = function(a, b) {
                    if (!Y(a)) throw new TypeError("list argument must be an Array of Buffers.");
                    if (0 === a.length) return new f(0);
                    var c;
                    if (void 0 === b)
                        for (b = 0, c = 0; c < a.length; c++) b += a[c].length;
                    var d = new f(b),
                        e = 0;
                    for (c = 0; c < a.length; c++) {
                        var g = a[c];
                        g.copy(d, e), e += g.length }
                    return d }, f.byteLength = s, f.prototype.toString = function() {
                    var a = 0 | this.length;
                    return 0 === a ? "" : 0 === arguments.length ? B(this, 0, a) : t.apply(this, arguments) }, f.prototype.equals = function(a) {
                    if (!f.isBuffer(a)) throw new TypeError("Argument must be a Buffer");
                    return this === a ? !0 : 0 === f.compare(this, a) }, f.prototype.inspect = function() {
                    var a = "",
                        b = c.INSPECT_MAX_BYTES;
                    return this.length > 0 && (a = this.toString("hex", 0, b).match(/.{2}/g).join(" "), this.length > b && (a += " ... ")), "<Buffer " + a + ">" }, f.prototype.compare = function(a) {
                    if (!f.isBuffer(a)) throw new TypeError("Argument must be a Buffer");
                    return this === a ? 0 : f.compare(this, a) }, f.prototype.indexOf = function(a, b) {
                    function c(a, b, c) {
                        for (var d = -1, e = 0; c + e < a.length; e++)
                            if (a[c + e] === b[-1 === d ? 0 : e - d]) {
                                if (-1 === d && (d = e), e - d + 1 === b.length) return c + d } else d = -1;
                        return -1 }
                    if (b > 2147483647 ? b = 2147483647 : -2147483648 > b && (b = -2147483648), b >>= 0, 0 === this.length) return -1;
                    if (b >= this.length) return -1;
                    if (0 > b && (b = Math.max(this.length + b, 0)), "string" == typeof a) return 0 === a.length ? -1 : String.prototype.indexOf.call(this, a, b);
                    if (f.isBuffer(a)) return c(this, a, b);
                    if ("number" == typeof a) return f.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf ? Uint8Array.prototype.indexOf.call(this, a, b) : c(this, [a], b);
                    throw new TypeError("val must be string, number or Buffer") }, f.prototype.get = function(a) {
                    return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(a) }, f.prototype.set = function(a, b) {
                    return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(a, b) }, f.prototype.write = function(a, b, c, d) {
                    if (void 0 === b) d = "utf8", c = this.length, b = 0;
                    else if (void 0 === c && "string" == typeof b) d = b, c = this.length, b = 0;
                    else if (isFinite(b)) b = 0 | b, isFinite(c) ? (c = 0 | c, void 0 === d && (d = "utf8")) : (d = c, c = void 0);
                    else {
                        var e = d;
                        d = b, b = 0 | c, c = e }
                    var f = this.length - b;
                    if ((void 0 === c || c > f) && (c = f), a.length > 0 && (0 > c || 0 > b) || b > this.length) throw new RangeError("attempt to write outside buffer bounds");
                    d || (d = "utf8");
                    for (var g = !1;;) switch (d) {
                        case "hex":
                            return u(this, a, b, c);
                        case "utf8":
                        case "utf-8":
                            return v(this, a, b, c);
                        case "ascii":
                            return w(this, a, b, c);
                        case "binary":
                            return x(this, a, b, c);
                        case "base64":
                            return y(this, a, b, c);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return z(this, a, b, c);
                        default:
                            if (g) throw new TypeError("Unknown encoding: " + d);
                            d = ("" + d).toLowerCase(), g = !0 } }, f.prototype.toJSON = function() {
                    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) } };
                var $ = 4096;
                f.prototype.slice = function(a, b) {
                    var c = this.length;
                    a = ~~a, b = void 0 === b ? c : ~~b, 0 > a ? (a += c, 0 > a && (a = 0)) : a > c && (a = c), 0 > b ? (b += c, 0 > b && (b = 0)) : b > c && (b = c), a > b && (b = a);
                    var d;
                    if (f.TYPED_ARRAY_SUPPORT) d = f._augment(this.subarray(a, b));
                    else {
                        var e = b - a;
                        d = new f(e, void 0);
                        for (var g = 0; e > g; g++) d[g] = this[g + a] }
                    return d.length && (d.parent = this.parent || this), d }, f.prototype.readUIntLE = function(a, b, c) { a = 0 | a, b = 0 | b, c || H(a, b, this.length);
                    for (var d = this[a], e = 1, f = 0; ++f < b && (e *= 256);) d += this[a + f] * e;
                    return d }, f.prototype.readUIntBE = function(a, b, c) { a = 0 | a, b = 0 | b, c || H(a, b, this.length);
                    for (var d = this[a + --b], e = 1; b > 0 && (e *= 256);) d += this[a + --b] * e;
                    return d }, f.prototype.readUInt8 = function(a, b) {
                    return b || H(a, 1, this.length), this[a] }, f.prototype.readUInt16LE = function(a, b) {
                    return b || H(a, 2, this.length), this[a] | this[a + 1] << 8 }, f.prototype.readUInt16BE = function(a, b) {
                    return b || H(a, 2, this.length), this[a] << 8 | this[a + 1] }, f.prototype.readUInt32LE = function(a, b) {
                    return b || H(a, 4, this.length), (this[a] | this[a + 1] << 8 | this[a + 2] << 16) + 16777216 * this[a + 3] }, f.prototype.readUInt32BE = function(a, b) {
                    return b || H(a, 4, this.length), 16777216 * this[a] + (this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3]) }, f.prototype.readIntLE = function(a, b, c) { a = 0 | a, b = 0 | b, c || H(a, b, this.length);
                    for (var d = this[a], e = 1, f = 0; ++f < b && (e *= 256);) d += this[a + f] * e;
                    return e *= 128, d >= e && (d -= Math.pow(2, 8 * b)), d }, f.prototype.readIntBE = function(a, b, c) { a = 0 | a, b = 0 | b, c || H(a, b, this.length);
                    for (var d = b, e = 1, f = this[a + --d]; d > 0 && (e *= 256);) f += this[a + --d] * e;
                    return e *= 128, f >= e && (f -= Math.pow(2, 8 * b)), f }, f.prototype.readInt8 = function(a, b) {
                    return b || H(a, 1, this.length), 128 & this[a] ? -1 * (255 - this[a] + 1) : this[a] }, f.prototype.readInt16LE = function(a, b) { b || H(a, 2, this.length);
                    var c = this[a] | this[a + 1] << 8;
                    return 32768 & c ? 4294901760 | c : c }, f.prototype.readInt16BE = function(a, b) { b || H(a, 2, this.length);
                    var c = this[a + 1] | this[a] << 8;
                    return 32768 & c ? 4294901760 | c : c }, f.prototype.readInt32LE = function(a, b) {
                    return b || H(a, 4, this.length), this[a] | this[a + 1] << 8 | this[a + 2] << 16 | this[a + 3] << 24 }, f.prototype.readInt32BE = function(a, b) {
                    return b || H(a, 4, this.length), this[a] << 24 | this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3] }, f.prototype.readFloatLE = function(a, b) {
                    return b || H(a, 4, this.length), X.read(this, a, !0, 23, 4) }, f.prototype.readFloatBE = function(a, b) {
                    return b || H(a, 4, this.length), X.read(this, a, !1, 23, 4) }, f.prototype.readDoubleLE = function(a, b) {
                    return b || H(a, 8, this.length), X.read(this, a, !0, 52, 8) }, f.prototype.readDoubleBE = function(a, b) {
                    return b || H(a, 8, this.length), X.read(this, a, !1, 52, 8) }, f.prototype.writeUIntLE = function(a, b, c, d) { a = +a, b = 0 | b, c = 0 | c, d || I(this, a, b, c, Math.pow(2, 8 * c), 0);
                    var e = 1,
                        f = 0;
                    for (this[b] = 255 & a; ++f < c && (e *= 256);) this[b + f] = a / e & 255;
                    return b + c }, f.prototype.writeUIntBE = function(a, b, c, d) { a = +a, b = 0 | b, c = 0 | c, d || I(this, a, b, c, Math.pow(2, 8 * c), 0);
                    var e = c - 1,
                        f = 1;
                    for (this[b + e] = 255 & a; --e >= 0 && (f *= 256);) this[b + e] = a / f & 255;
                    return b + c }, f.prototype.writeUInt8 = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (a = Math.floor(a)), this[b] = 255 & a, b + 1 }, f.prototype.writeUInt16LE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[b] = 255 & a, this[b + 1] = a >>> 8) : J(this, a, b, !0), b + 2 }, f.prototype.writeUInt16BE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[b] = a >>> 8, this[b + 1] = 255 & a) : J(this, a, b, !1), b + 2 }, f.prototype.writeUInt32LE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[b + 3] = a >>> 24, this[b + 2] = a >>> 16, this[b + 1] = a >>> 8, this[b] = 255 & a) : K(this, a, b, !0), b + 4 }, f.prototype.writeUInt32BE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[b] = a >>> 24, this[b + 1] = a >>> 16, this[b + 2] = a >>> 8, this[b + 3] = 255 & a) : K(this, a, b, !1), b + 4 }, f.prototype.writeIntLE = function(a, b, c, d) {
                    if (a = +a, b = 0 | b, !d) {
                        var e = Math.pow(2, 8 * c - 1);
                        I(this, a, b, c, e - 1, -e) }
                    var f = 0,
                        g = 1,
                        h = 0 > a ? 1 : 0;
                    for (this[b] = 255 & a; ++f < c && (g *= 256);) this[b + f] = (a / g >> 0) - h & 255;
                    return b + c }, f.prototype.writeIntBE = function(a, b, c, d) {
                    if (a = +a, b = 0 | b, !d) {
                        var e = Math.pow(2, 8 * c - 1);
                        I(this, a, b, c, e - 1, -e) }
                    var f = c - 1,
                        g = 1,
                        h = 0 > a ? 1 : 0;
                    for (this[b + f] = 255 & a; --f >= 0 && (g *= 256);) this[b + f] = (a / g >> 0) - h & 255;
                    return b + c }, f.prototype.writeInt8 = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (a = Math.floor(a)), 0 > a && (a = 255 + a + 1), this[b] = 255 & a, b + 1 }, f.prototype.writeInt16LE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[b] = 255 & a, this[b + 1] = a >>> 8) : J(this, a, b, !0), b + 2 }, f.prototype.writeInt16BE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[b] = a >>> 8, this[b + 1] = 255 & a) : J(this, a, b, !1), b + 2 }, f.prototype.writeInt32LE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[b] = 255 & a, this[b + 1] = a >>> 8, this[b + 2] = a >>> 16, this[b + 3] = a >>> 24) : K(this, a, b, !0), b + 4 }, f.prototype.writeInt32BE = function(a, b, c) {
                    return a = +a, b = 0 | b, c || I(this, a, b, 4, 2147483647, -2147483648), 0 > a && (a = 4294967295 + a + 1), f.TYPED_ARRAY_SUPPORT ? (this[b] = a >>> 24, this[b + 1] = a >>> 16, this[b + 2] = a >>> 8, this[b + 3] = 255 & a) : K(this, a, b, !1), b + 4 }, f.prototype.writeFloatLE = function(a, b, c) {
                    return M(this, a, b, !0, c) }, f.prototype.writeFloatBE = function(a, b, c) {
                    return M(this, a, b, !1, c) }, f.prototype.writeDoubleLE = function(a, b, c) {
                    return N(this, a, b, !0, c) }, f.prototype.writeDoubleBE = function(a, b, c) {
                    return N(this, a, b, !1, c) }, f.prototype.copy = function(a, b, c, d) {
                    if (c || (c = 0), d || 0 === d || (d = this.length), b >= a.length && (b = a.length), b || (b = 0), d > 0 && c > d && (d = c), d === c) return 0;
                    if (0 === a.length || 0 === this.length) return 0;
                    if (0 > b) throw new RangeError("targetStart out of bounds");
                    if (0 > c || c >= this.length) throw new RangeError("sourceStart out of bounds");
                    if (0 > d) throw new RangeError("sourceEnd out of bounds");
                    d > this.length && (d = this.length), a.length - b < d - c && (d = a.length - b + c);
                    var e, g = d - c;
                    if (this === a && b > c && d > b)
                        for (e = g - 1; e >= 0; e--) a[e + b] = this[e + c];
                    else if (1e3 > g || !f.TYPED_ARRAY_SUPPORT)
                        for (e = 0; g > e; e++) a[e + b] = this[e + c];
                    else a._set(this.subarray(c, c + g), b);
                    return g }, f.prototype.fill = function(a, b, c) {
                    if (a || (a = 0), b || (b = 0), c || (c = this.length), b > c) throw new RangeError("end < start");
                    if (c !== b && 0 !== this.length) {
                        if (0 > b || b >= this.length) throw new RangeError("start out of bounds");
                        if (0 > c || c > this.length) throw new RangeError("end out of bounds");
                        var d;
                        if ("number" == typeof a)
                            for (d = b; c > d; d++) this[d] = a;
                        else {
                            var e = R(a.toString()),
                                f = e.length;
                            for (d = b; c > d; d++) this[d] = e[d % f]
                        }
                        return this
                    }
                }, f.prototype.toArrayBuffer = function() {
                    if ("undefined" != typeof Uint8Array) {
                        if (f.TYPED_ARRAY_SUPPORT) return new f(this).buffer;
                        for (var a = new Uint8Array(this.length), b = 0, c = a.length; c > b; b += 1) a[b] = this[b];
                        return a.buffer }
                    throw new TypeError("Buffer.toArrayBuffer not supported in this browser") };
                var _ = f.prototype;
                f._augment = function(a) {
                    return a.constructor = f, a._isBuffer = !0, a._set = a.set, a.get = _.get, a.set = _.set, a.write = _.write, a.toString = _.toString, a.toLocaleString = _.toString, a.toJSON = _.toJSON, a.equals = _.equals, a.compare = _.compare, a.indexOf = _.indexOf, a.copy = _.copy, a.slice = _.slice, a.readUIntLE = _.readUIntLE, a.readUIntBE = _.readUIntBE, a.readUInt8 = _.readUInt8, a.readUInt16LE = _.readUInt16LE, a.readUInt16BE = _.readUInt16BE, a.readUInt32LE = _.readUInt32LE, a.readUInt32BE = _.readUInt32BE, a.readIntLE = _.readIntLE, a.readIntBE = _.readIntBE, a.readInt8 = _.readInt8, a.readInt16LE = _.readInt16LE, a.readInt16BE = _.readInt16BE, a.readInt32LE = _.readInt32LE, a.readInt32BE = _.readInt32BE, a.readFloatLE = _.readFloatLE, a.readFloatBE = _.readFloatBE, a.readDoubleLE = _.readDoubleLE, a.readDoubleBE = _.readDoubleBE, a.writeUInt8 = _.writeUInt8, a.writeUIntLE = _.writeUIntLE, a.writeUIntBE = _.writeUIntBE, a.writeUInt16LE = _.writeUInt16LE, a.writeUInt16BE = _.writeUInt16BE, a.writeUInt32LE = _.writeUInt32LE, a.writeUInt32BE = _.writeUInt32BE, a.writeIntLE = _.writeIntLE, a.writeIntBE = _.writeIntBE, a.writeInt8 = _.writeInt8, a.writeInt16LE = _.writeInt16LE, a.writeInt16BE = _.writeInt16BE, a.writeInt32LE = _.writeInt32LE, a.writeInt32BE = _.writeInt32BE, a.writeFloatLE = _.writeFloatLE, a.writeFloatBE = _.writeFloatBE, a.writeDoubleLE = _.writeDoubleLE, a.writeDoubleBE = _.writeDoubleBE, a.fill = _.fill, a.inspect = _.inspect, a.toArrayBuffer = _.toArrayBuffer, a };
                var aa = /[^+\/0-9A-Za-z-_]/g
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, { "base64-js": 3, ieee754: 13, isarray: 6 }],
        6: [function(a, b, c) {
            var d = {}.toString;
            b.exports = Array.isArray || function(a) {
                return "[object Array]" == d.call(a) } }, {}],
        7: [function(b, c, d) {! function(b, e) { "object" == typeof d ? c.exports = d = e() : "function" == typeof a && a.amd ? a([], e) : b.CryptoJS = e() }(this, function() {
                var a = a || function(a, b) {
                    var c = {},
                        d = c.lib = {},
                        e = d.Base = function() {
                            function a() {}
                            return { extend: function(b) { a.prototype = this;
                                    var c = new a;
                                    return b && c.mixIn(b), c.hasOwnProperty("init") || (c.init = function() { c.$super.init.apply(this, arguments) }), c.init.prototype = c, c.$super = this, c }, create: function() {
                                    var a = this.extend();
                                    return a.init.apply(a, arguments), a }, init: function() {}, mixIn: function(a) {
                                    for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                                    a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function() {
                                    return this.init.prototype.extend(this) } } }(),
                        f = d.WordArray = e.extend({ init: function(a, c) { a = this.words = a || [], c != b ? this.sigBytes = c : this.sigBytes = 4 * a.length }, toString: function(a) {
                                return (a || h).stringify(this) }, concat: function(a) {
                                var b = this.words,
                                    c = a.words,
                                    d = this.sigBytes,
                                    e = a.sigBytes;
                                if (this.clamp(), d % 4)
                                    for (var f = 0; e > f; f++) {
                                        var g = c[f >>> 2] >>> 24 - f % 4 * 8 & 255;
                                        b[d + f >>> 2] |= g << 24 - (d + f) % 4 * 8 } else
                                        for (var f = 0; e > f; f += 4) b[d + f >>> 2] = c[f >>> 2];
                                return this.sigBytes += e, this }, clamp: function() {
                                var b = this.words,
                                    c = this.sigBytes;
                                b[c >>> 2] &= 4294967295 << 32 - c % 4 * 8, b.length = a.ceil(c / 4) }, clone: function() {
                                var a = e.clone.call(this);
                                return a.words = this.words.slice(0), a }, random: function(b) {
                                for (var c, d = [], e = function(b) {
                                        var b = b,
                                            c = 987654321,
                                            d = 4294967295;
                                        return function() { c = 36969 * (65535 & c) + (c >> 16) & d, b = 18e3 * (65535 & b) + (b >> 16) & d;
                                            var e = (c << 16) + b & d;
                                            return e /= 4294967296, e += .5, e * (a.random() > .5 ? 1 : -1) } }, g = 0; b > g; g += 4) {
                                    var h = e(4294967296 * (c || a.random()));
                                    c = 987654071 * h(), d.push(4294967296 * h() | 0) }
                                return new f.init(d, b) } }),
                        g = c.enc = {},
                        h = g.Hex = { stringify: function(a) {
                                for (var b = a.words, c = a.sigBytes, d = [], e = 0; c > e; e++) {
                                    var f = b[e >>> 2] >>> 24 - e % 4 * 8 & 255;
                                    d.push((f >>> 4).toString(16)), d.push((15 & f).toString(16)) }
                                return d.join("") }, parse: function(a) {
                                for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - d % 8 * 4;
                                return new f.init(c, b / 2) } },
                        i = g.Latin1 = { stringify: function(a) {
                                for (var b = a.words, c = a.sigBytes, d = [], e = 0; c > e; e++) {
                                    var f = b[e >>> 2] >>> 24 - e % 4 * 8 & 255;
                                    d.push(String.fromCharCode(f)) }
                                return d.join("") }, parse: function(a) {
                                for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - d % 4 * 8;
                                return new f.init(c, b) } },
                        j = g.Utf8 = { stringify: function(a) {
                                try {
                                    return decodeURIComponent(escape(i.stringify(a))) } catch (b) {
                                    throw new Error("Malformed UTF-8 data") } }, parse: function(a) {
                                return i.parse(unescape(encodeURIComponent(a))) } },
                        k = d.BufferedBlockAlgorithm = e.extend({ reset: function() { this._data = new f.init, this._nDataBytes = 0 }, _append: function(a) { "string" == typeof a && (a = j.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes }, _process: function(b) {
                                var c = this._data,
                                    d = c.words,
                                    e = c.sigBytes,
                                    g = this.blockSize,
                                    h = 4 * g,
                                    i = e / h;
                                i = b ? a.ceil(i) : a.max((0 | i) - this._minBufferSize, 0);
                                var j = i * g,
                                    k = a.min(4 * j, e);
                                if (j) {
                                    for (var l = 0; j > l; l += g) this._doProcessBlock(d, l);
                                    var m = d.splice(0, j);
                                    c.sigBytes -= k }
                                return new f.init(m, k) }, clone: function() {
                                var a = e.clone.call(this);
                                return a._data = this._data.clone(), a }, _minBufferSize: 0 }),
                        l = (d.Hasher = k.extend({ cfg: e.extend(), init: function(a) { this.cfg = this.cfg.extend(a), this.reset() }, reset: function() { k.reset.call(this), this._doReset() }, update: function(a) {
                                return this._append(a), this._process(), this }, finalize: function(a) { a && this._append(a);
                                var b = this._doFinalize();
                                return b }, blockSize: 16, _createHelper: function(a) {
                                return function(b, c) {
                                    return new a.init(c).finalize(b) } }, _createHmacHelper: function(a) {
                                return function(b, c) {
                                    return new l.HMAC.init(a, c).finalize(b) } } }), c.algo = {});
                    return c }(Math);
                return a }) }, {}],
        8: [function(b, c, d) {! function(e, f) { "object" == typeof d ? c.exports = d = f(b("./core")) : "function" == typeof a && a.amd ? a(["./core"], f) : f(e.CryptoJS) }(this, function(a) {
                return function() {
                    var b = a,
                        c = b.lib,
                        d = c.WordArray,
                        e = b.enc;
                    e.Base64 = { stringify: function(a) {
                            var b = a.words,
                                c = a.sigBytes,
                                d = this._map;
                            a.clamp();
                            for (var e = [], f = 0; c > f; f += 3)
                                for (var g = b[f >>> 2] >>> 24 - f % 4 * 8 & 255, h = b[f + 1 >>> 2] >>> 24 - (f + 1) % 4 * 8 & 255, i = b[f + 2 >>> 2] >>> 24 - (f + 2) % 4 * 8 & 255, j = g << 16 | h << 8 | i, k = 0; 4 > k && c > f + .75 * k; k++) e.push(d.charAt(j >>> 6 * (3 - k) & 63));
                            var l = d.charAt(64);
                            if (l)
                                for (; e.length % 4;) e.push(l);
                            return e.join("") }, parse: function(a) {
                            var b = a.length,
                                c = this._map,
                                e = c.charAt(64);
                            if (e) {
                                var f = a.indexOf(e); - 1 != f && (b = f) }
                            for (var g = [], h = 0, i = 0; b > i; i++)
                                if (i % 4) {
                                    var j = c.indexOf(a.charAt(i - 1)) << i % 4 * 2,
                                        k = c.indexOf(a.charAt(i)) >>> 6 - i % 4 * 2,
                                        l = j | k;
                                    g[h >>> 2] |= l << 24 - h % 4 * 8, h++ }
                            return d.create(g, h) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } }(), a.enc.Base64 }) }, { "./core": 7 }],
        9: [function(b, c, d) {! function(e, f) { "object" == typeof d ? c.exports = d = f(b("./core")) : "function" == typeof a && a.amd ? a(["./core"], f) : f(e.CryptoJS) }(this, function(a) {
                return a.enc.Utf8 }) }, { "./core": 7 }],
        10: [function(b, c, d) {! function(e, f, g) { "object" == typeof d ? c.exports = d = f(b("./core"), b("./sha256"), b("./hmac")) : "function" == typeof a && a.amd ? a(["./core", "./sha256", "./hmac"], f) : f(e.CryptoJS) }(this, function(a) {
                return a.HmacSHA256 }) }, { "./core": 7, "./hmac": 11, "./sha256": 12 }],
        11: [function(b, c, d) {! function(e, f) { "object" == typeof d ? c.exports = d = f(b("./core")) : "function" == typeof a && a.amd ? a(["./core"], f) : f(e.CryptoJS) }(this, function(a) {! function() {
                    var b = a,
                        c = b.lib,
                        d = c.Base,
                        e = b.enc,
                        f = e.Utf8,
                        g = b.algo;
                    g.HMAC = d.extend({ init: function(a, b) { a = this._hasher = new a.init, "string" == typeof b && (b = f.parse(b));
                            var c = a.blockSize,
                                d = 4 * c;
                            b.sigBytes > d && (b = a.finalize(b)), b.clamp();
                            for (var e = this._oKey = b.clone(), g = this._iKey = b.clone(), h = e.words, i = g.words, j = 0; c > j; j++) h[j] ^= 1549556828, i[j] ^= 909522486;
                            e.sigBytes = g.sigBytes = d, this.reset() }, reset: function() {
                            var a = this._hasher;
                            a.reset(), a.update(this._iKey) }, update: function(a) {
                            return this._hasher.update(a), this }, finalize: function(a) {
                            var b = this._hasher,
                                c = b.finalize(a);
                            b.reset();
                            var d = b.finalize(this._oKey.clone().concat(c));
                            return d } }) }() }) }, { "./core": 7 }],
        12: [function(b, c, d) {! function(e, f) { "object" == typeof d ? c.exports = d = f(b("./core")) : "function" == typeof a && a.amd ? a(["./core"], f) : f(e.CryptoJS) }(this, function(a) {
                return function(b) {
                    var c = a,
                        d = c.lib,
                        e = d.WordArray,
                        f = d.Hasher,
                        g = c.algo,
                        h = [],
                        i = [];! function() {
                        function a(a) {
                            for (var c = b.sqrt(a), d = 2; c >= d; d++)
                                if (!(a % d)) return !1;
                            return !0 }

                        function c(a) {
                            return 4294967296 * (a - (0 | a)) | 0 }
                        for (var d = 2, e = 0; 64 > e;) a(d) && (8 > e && (h[e] = c(b.pow(d, .5))), i[e] = c(b.pow(d, 1 / 3)), e++), d++ }();
                    var j = [],
                        k = g.SHA256 = f.extend({ _doReset: function() { this._hash = new e.init(h.slice(0)) }, _doProcessBlock: function(a, b) {
                                for (var c = this._hash.words, d = c[0], e = c[1], f = c[2], g = c[3], h = c[4], k = c[5], l = c[6], m = c[7], n = 0; 64 > n; n++) {
                                    if (16 > n) j[n] = 0 | a[b + n];
                                    else {
                                        var o = j[n - 15],
                                            p = (o << 25 | o >>> 7) ^ (o << 14 | o >>> 18) ^ o >>> 3,
                                            q = j[n - 2],
                                            r = (q << 15 | q >>> 17) ^ (q << 13 | q >>> 19) ^ q >>> 10;
                                        j[n] = p + j[n - 7] + r + j[n - 16] }
                                    var s = h & k ^ ~h & l,
                                        t = d & e ^ d & f ^ e & f,
                                        u = (d << 30 | d >>> 2) ^ (d << 19 | d >>> 13) ^ (d << 10 | d >>> 22),
                                        v = (h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25),
                                        w = m + v + s + i[n] + j[n],
                                        x = u + t;
                                    m = l, l = k, k = h, h = g + w | 0, g = f, f = e, e = d, d = w + x | 0 }
                                c[0] = c[0] + d | 0, c[1] = c[1] + e | 0, c[2] = c[2] + f | 0, c[3] = c[3] + g | 0, c[4] = c[4] + h | 0, c[5] = c[5] + k | 0, c[6] = c[6] + l | 0, c[7] = c[7] + m | 0 }, _doFinalize: function() {
                                var a = this._data,
                                    c = a.words,
                                    d = 8 * this._nDataBytes,
                                    e = 8 * a.sigBytes;
                                return c[e >>> 5] |= 128 << 24 - e % 32, c[(e + 64 >>> 9 << 4) + 14] = b.floor(d / 4294967296), c[(e + 64 >>> 9 << 4) + 15] = d, a.sigBytes = 4 * c.length, this._process(), this._hash }, clone: function() {
                                var a = f.clone.call(this);
                                return a._hash = this._hash.clone(), a } });
                    c.SHA256 = f._createHelper(k), c.HmacSHA256 = f._createHmacHelper(k) }(Math), a.SHA256 }) }, { "./core": 7 }],
        13: [function(a, b, c) { c.read = function(a, b, c, d, e) {
                var f, g, h = 8 * e - d - 1,
                    i = (1 << h) - 1,
                    j = i >> 1,
                    k = -7,
                    l = c ? e - 1 : 0,
                    m = c ? -1 : 1,
                    n = a[b + l];
                for (l += m, f = n & (1 << -k) - 1, n >>= -k, k += h; k > 0; f = 256 * f + a[b + l], l += m, k -= 8);
                for (g = f & (1 << -k) - 1, f >>= -k, k += d; k > 0; g = 256 * g + a[b + l], l += m, k -= 8);
                if (0 === f) f = 1 - j;
                else {
                    if (f === i) return g ? NaN : (n ? -1 : 1) * (1 / 0);
                    g += Math.pow(2, d), f -= j }
                return (n ? -1 : 1) * g * Math.pow(2, f - d) }, c.write = function(a, b, c, d, e, f) {
                var g, h, i, j = 8 * f - e - 1,
                    k = (1 << j) - 1,
                    l = k >> 1,
                    m = 23 === e ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    n = d ? 0 : f - 1,
                    o = d ? 1 : -1,
                    p = 0 > b || 0 === b && 0 > 1 / b ? 1 : 0;
                for (b = Math.abs(b), isNaN(b) || b === 1 / 0 ? (h = isNaN(b) ? 1 : 0, g = k) : (g = Math.floor(Math.log(b) / Math.LN2), b * (i = Math.pow(2, -g)) < 1 && (g--, i *= 2), b += g + l >= 1 ? m / i : m * Math.pow(2, 1 - l), b * i >= 2 && (g++, i /= 2), g + l >= k ? (h = 0, g = k) : g + l >= 1 ? (h = (b * i - 1) * Math.pow(2, e), g += l) : (h = b * Math.pow(2, l - 1) * Math.pow(2, e), g = 0)); e >= 8; a[c + n] = 255 & h, n += o, h /= 256, e -= 8);
                for (g = g << e | h, j += e; j > 0; a[c + n] = 255 & g, n += o, g /= 256, j -= 8);
                a[c + n - o] |= 128 * p } }, {}],
        14: [function(a, b, c) {
            function d(a) {
                if (j === setTimeout) return setTimeout(a, 0);
                try {
                    return j(a, 0) } catch (b) {
                    try {
                        return j.call(null, a, 0) } catch (b) {
                        return j.call(this, a, 0) } } }

            function e(a) {
                if (k === clearTimeout) return clearTimeout(a);
                try {
                    return k(a) } catch (b) {
                    try {
                        return k.call(null, a) } catch (b) {
                        return k.call(this, a) } } }

            function f() { o && m && (o = !1, m.length ? n = m.concat(n) : p = -1, n.length && g()) }

            function g() {
                if (!o) {
                    var a = d(f);
                    o = !0;
                    for (var b = n.length; b;) {
                        for (m = n, n = []; ++p < b;) m && m[p].run();
                        p = -1, b = n.length }
                    m = null, o = !1, e(a) } }

            function h(a, b) { this.fun = a, this.array = b }

            function i() {}
            var j, k, l = b.exports = {};! function() {
                try { j = setTimeout } catch (a) { j = function() {
                        throw new Error("setTimeout is not defined") } }
                try { k = clearTimeout } catch (a) { k = function() {
                        throw new Error("clearTimeout is not defined") } } }();
            var m, n = [],
                o = !1,
                p = -1;
            l.nextTick = function(a) {
                var b = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
                n.push(new h(a, b)), 1 !== n.length || o || d(g) }, h.prototype.run = function() { this.fun.apply(null, this.array) }, l.title = "browser", l.browser = !0, l.env = {}, l.argv = [], l.version = "", l.versions = {}, l.on = i, l.addListener = i, l.once = i, l.off = i, l.removeListener = i, l.removeAllListeners = i, l.emit = i, l.binding = function(a) {
                throw new Error("process.binding is not supported") }, l.cwd = function() {
                return "/" }, l.chdir = function(a) {
                throw new Error("process.chdir is not supported") }, l.umask = function() {
                return 0 } }, {}],
        15: [function(b, c, d) {
            (function(b) {! function(b) { "use strict";
                    if ("function" == typeof bootstrap) bootstrap("promise", b);
                    else if ("object" == typeof d && "object" == typeof c) c.exports = b();
                    else if ("function" == typeof a && a.amd) a(b);
                    else if ("undefined" != typeof ses) {
                        if (!ses.ok()) return;
                        ses.makeQ = b } else {
                        if ("undefined" == typeof window && "undefined" == typeof self) throw new Error("This environment was not anticipated by Q. Please file a bug.");
                        var e = "undefined" != typeof window ? window : self,
                            f = e.Q;
                        e.Q = b(), e.Q.noConflict = function() {
                            return e.Q = f, this } } }(function() { "use strict";

                    function a(a) {
                        return function() {
                            return X.apply(a, arguments) } }

                    function c(a) {
                        return a === Object(a) }

                    function d(a) {
                        return "[object StopIteration]" === da(a) || a instanceof T }

                    function e(a, b) {
                        if (Q && b.stack && "object" == typeof a && null !== a && a.stack && -1 === a.stack.indexOf(ea)) {
                            for (var c = [], d = b; d; d = d.source) d.stack && c.unshift(d.stack);
                            c.unshift(a.stack);
                            var e = c.join("\n" + ea + "\n");
                            a.stack = f(e) } }

                    function f(a) {
                        for (var b = a.split("\n"), c = [], d = 0; d < b.length; ++d) {
                            var e = b[d];
                            i(e) || g(e) || !e || c.push(e) }
                        return c.join("\n") }

                    function g(a) {
                        return -1 !== a.indexOf("(module.js:") || -1 !== a.indexOf("(node.js:") }

                    function h(a) {
                        var b = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(a);
                        if (b) return [b[1], Number(b[2])];
                        var c = /at ([^ ]+):(\d+):(?:\d+)$/.exec(a);
                        if (c) return [c[1], Number(c[2])];
                        var d = /.*@(.+):(\d+)$/.exec(a);
                        return d ? [d[1], Number(d[2])] : void 0 }

                    function i(a) {
                        var b = h(a);
                        if (!b) return !1;
                        var c = b[0],
                            d = b[1];
                        return c === S && d >= U && ja >= d }

                    function j() {
                        if (Q) try {
                            throw new Error } catch (a) {
                            var b = a.stack.split("\n"),
                                c = b[0].indexOf("@") > 0 ? b[1] : b[2],
                                d = h(c);
                            if (!d) return;
                            return S = d[0], d[1] } }

                    function k(a, b, c) {
                        return function() {
                            return "undefined" != typeof console && "function" == typeof console.warn && console.warn(b + " is deprecated, use " + c + " instead.", new Error("").stack), a.apply(a, arguments) } }

                    function l(a) {
                        return a instanceof p ? a : t(a) ? C(a) : B(a) }

                    function m() {
                        function a(a) { b = a, f.source = a, Z(c, function(b, c) { l.nextTick(function() { a.promiseDispatch.apply(a, c) }) }, void 0), c = void 0, d = void 0 }
                        var b, c = [],
                            d = [],
                            e = aa(m.prototype),
                            f = aa(p.prototype);
                        if (f.promiseDispatch = function(a, e, f) {
                                var g = Y(arguments);
                                c ? (c.push(g), "when" === e && f[1] && d.push(f[1])) : l.nextTick(function() { b.promiseDispatch.apply(b, g) }) }, f.valueOf = function() {
                                if (c) return f;
                                var a = r(b);
                                return s(a) && (b = a), a }, f.inspect = function() {
                                return b ? b.inspect() : { state: "pending" } }, l.longStackSupport && Q) try {
                            throw new Error } catch (g) { f.stack = g.stack.substring(g.stack.indexOf("\n") + 1) }
                        return e.promise = f, e.resolve = function(c) { b || a(l(c)) }, e.fulfill = function(c) { b || a(B(c)) }, e.reject = function(c) { b || a(A(c)) }, e.notify = function(a) { b || Z(d, function(b, c) { l.nextTick(function() { c(a) }) }, void 0) }, e }

                    function n(a) {
                        if ("function" != typeof a) throw new TypeError("resolver must be a function.");
                        var b = m();
                        try { a(b.resolve, b.reject, b.notify) } catch (c) { b.reject(c) }
                        return b.promise }

                    function o(a) {
                        return n(function(b, c) {
                            for (var d = 0, e = a.length; e > d; d++) l(a[d]).then(b, c) }) }

                    function p(a, b, c) { void 0 === b && (b = function(a) {
                            return A(new Error("Promise does not support operation: " + a)) }), void 0 === c && (c = function() {
                            return { state: "unknown" } });
                        var d = aa(p.prototype);
                        if (d.promiseDispatch = function(c, e, f) {
                                var g;
                                try { g = a[e] ? a[e].apply(d, f) : b.call(d, e, f) } catch (h) { g = A(h) }
                                c && c(g) }, d.inspect = c, c) {
                            var e = c(); "rejected" === e.state && (d.exception = e.reason), d.valueOf = function() {
                                var a = c();
                                return "pending" === a.state || "rejected" === a.state ? d : a.value } }
                        return d }

                    function q(a, b, c, d) {
                        return l(a).then(b, c, d) }

                    function r(a) {
                        if (s(a)) {
                            var b = a.inspect();
                            if ("fulfilled" === b.state) return b.value }
                        return a }

                    function s(a) {
                        return a instanceof p }

                    function t(a) {
                        return c(a) && "function" == typeof a.then }

                    function u(a) {
                        return s(a) && "pending" === a.inspect().state }

                    function v(a) {
                        return !s(a) || "fulfilled" === a.inspect().state }

                    function w(a) {
                        return s(a) && "rejected" === a.inspect().state }

                    function x() { fa.length = 0, ga.length = 0, ia || (ia = !0) }

                    function y(a, c) { ia && ("object" == typeof b && "function" == typeof b.emit && l.nextTick.runAfter(function() {-1 !== $(ga, a) && (b.emit("unhandledRejection", c, a), ha.push(a)) }), ga.push(a), c && "undefined" != typeof c.stack ? fa.push(c.stack) : fa.push("(no stack) " + c)) }

                    function z(a) {
                        if (ia) {
                            var c = $(ga, a); - 1 !== c && ("object" == typeof b && "function" == typeof b.emit && l.nextTick.runAfter(function() {
                                var d = $(ha, a); - 1 !== d && (b.emit("rejectionHandled", fa[c], a), ha.splice(d, 1)) }), ga.splice(c, 1), fa.splice(c, 1)) } }

                    function A(a) {
                        var b = p({ when: function(b) {
                                return b && z(this), b ? b(a) : this } }, function() {
                            return this }, function() {
                            return { state: "rejected", reason: a } });
                        return y(b, a), b }

                    function B(a) {
                        return p({ when: function() {
                                return a }, get: function(b) {
                                return a[b] }, set: function(b, c) { a[b] = c }, "delete": function(b) { delete a[b] }, post: function(b, c) {
                                return null === b || void 0 === b ? a.apply(void 0, c) : a[b].apply(a, c) }, apply: function(b, c) {
                                return a.apply(b, c) }, keys: function() {
                                return ca(a) } }, void 0, function() {
                            return { state: "fulfilled", value: a } }) }

                    function C(a) {
                        var b = m();
                        return l.nextTick(function() {
                            try { a.then(b.resolve, b.reject, b.notify) } catch (c) { b.reject(c) } }), b.promise }

                    function D(a) {
                        return p({ isDef: function() {} }, function(b, c) {
                            return J(a, b, c) }, function() {
                            return l(a).inspect() }) }

                    function E(a, b, c) {
                        return l(a).spread(b, c) }

                    function F(a) {
                        return function() {
                            function b(a, b) {
                                var g;
                                if ("undefined" == typeof StopIteration) {
                                    try { g = c[a](b) } catch (h) {
                                        return A(h) }
                                    return g.done ? l(g.value) : q(g.value, e, f) }
                                try { g = c[a](b) } catch (h) {
                                    return d(h) ? l(h.value) : A(h) }
                                return q(g, e, f) }
                            var c = a.apply(this, arguments),
                                e = b.bind(b, "next"),
                                f = b.bind(b, "throw");
                            return e() } }

                    function G(a) { l.done(l.async(a)()) }

                    function H(a) {
                        throw new T(a) }

                    function I(a) {
                        return function() {
                            return E([this, K(arguments)], function(b, c) {
                                return a.apply(b, c) }) } }

                    function J(a, b, c) {
                        return l(a).dispatch(b, c) }

                    function K(a) {
                        return q(a, function(a) {
                            var b = 0,
                                c = m();
                            return Z(a, function(d, e, f) {
                                var g;
                                s(e) && "fulfilled" === (g = e.inspect()).state ? a[f] = g.value : (++b, q(e, function(d) { a[f] = d, 0 === --b && c.resolve(a) }, c.reject, function(a) { c.notify({ index: f, value: a }) })) }, void 0), 0 === b && c.resolve(a), c.promise }) }

                    function L(a) {
                        if (0 === a.length) return l.resolve();
                        var b = l.defer(),
                            c = 0;
                        return Z(a, function(d, e, f) {
                            function g(a) { b.resolve(a) }

                            function h() { c--, 0 === c && b.reject(new Error("Can't get fulfillment value from any promise, all promises were rejected.")) }

                            function i(a) { b.notify({ index: f, value: a }) }
                            var j = a[f];
                            c++, q(j, g, h, i) }, void 0), b.promise }

                    function M(a) {
                        return q(a, function(a) {
                            return a = _(a, l), q(K(_(a, function(a) {
                                return q(a, V, V) })), function() {
                                return a }) }) }

                    function N(a) {
                        return l(a).allSettled() }

                    function O(a, b) {
                        return l(a).then(void 0, void 0, b) }

                    function P(a, b) {
                        return l(a).nodeify(b) }
                    var Q = !1;
                    try {
                        throw new Error } catch (R) { Q = !!R.stack }
                    var S, T, U = j(),
                        V = function() {},
                        W = function() {
                            function a() {
                                for (var a, b; d.next;) d = d.next, a = d.task, d.task = void 0, b = d.domain, b && (d.domain = void 0, b.enter()), c(a, b);
                                for (; i.length;) a = i.pop(), c(a);
                                f = !1 }

                            function c(b, c) {
                                try { b() } catch (d) {
                                    if (h) throw c && c.exit(), setTimeout(a, 0), c && c.enter(), d;
                                    setTimeout(function() {
                                        throw d }, 0) }
                                c && c.exit() }
                            var d = { task: void 0, next: null },
                                e = d,
                                f = !1,
                                g = void 0,
                                h = !1,
                                i = [];
                            if (W = function(a) { e = e.next = { task: a, domain: h && b.domain, next: null }, f || (f = !0, g()) }, "object" == typeof b && "[object process]" === b.toString() && b.nextTick) h = !0, g = function() { b.nextTick(a) };
                            else if ("function" == typeof setImmediate) g = "undefined" != typeof window ? setImmediate.bind(window, a) : function() { setImmediate(a) };
                            else if ("undefined" != typeof MessageChannel) {
                                var j = new MessageChannel;
                                j.port1.onmessage = function() { g = k, j.port1.onmessage = a, a() };
                                var k = function() { j.port2.postMessage(0) };
                                g = function() { setTimeout(a, 0), k() } } else g = function() { setTimeout(a, 0) };
                            return W.runAfter = function(a) { i.push(a), f || (f = !0, g()) }, W }(),
                        X = Function.call,
                        Y = a(Array.prototype.slice),
                        Z = a(Array.prototype.reduce || function(a, b) {
                            var c = 0,
                                d = this.length;
                            if (1 === arguments.length)
                                for (;;) {
                                    if (c in this) { b = this[c++];
                                        break }
                                    if (++c >= d) throw new TypeError }
                            for (; d > c; c++) c in this && (b = a(b, this[c], c));
                            return b }),
                        $ = a(Array.prototype.indexOf || function(a) {
                            for (var b = 0; b < this.length; b++)
                                if (this[b] === a) return b;
                            return -1 }),
                        _ = a(Array.prototype.map || function(a, b) {
                            var c = this,
                                d = [];
                            return Z(c, function(e, f, g) { d.push(a.call(b, f, g, c)) }, void 0), d }),
                        aa = Object.create || function(a) {
                            function b() {}
                            return b.prototype = a, new b },
                        ba = a(Object.prototype.hasOwnProperty),
                        ca = Object.keys || function(a) {
                            var b = [];
                            for (var c in a) ba(a, c) && b.push(c);
                            return b },
                        da = a(Object.prototype.toString);
                    T = "undefined" != typeof ReturnValue ? ReturnValue : function(a) { this.value = a };
                    var ea = "From previous event:";
                    l.resolve = l, l.nextTick = W, l.longStackSupport = !1, "object" == typeof b && b && b.env && b.env.Q_DEBUG && (l.longStackSupport = !0), l.defer = m, m.prototype.makeNodeResolver = function() {
                        var a = this;
                        return function(b, c) { b ? a.reject(b) : arguments.length > 2 ? a.resolve(Y(arguments, 1)) : a.resolve(c) } }, l.Promise = n, l.promise = n, n.race = o, n.all = K, n.reject = A, n.resolve = l, l.passByCopy = function(a) {
                        return a }, p.prototype.passByCopy = function() {
                        return this }, l.join = function(a, b) {
                        return l(a).join(b) }, p.prototype.join = function(a) {
                        return l([this, a]).spread(function(a, b) {
                            if (a === b) return a;
                            throw new Error("Can't join: not the same: " + a + " " + b) }) }, l.race = o, p.prototype.race = function() {
                        return this.then(l.race) }, l.makePromise = p, p.prototype.toString = function() {
                        return "[object Promise]" }, p.prototype.then = function(a, b, c) {
                        function d(b) {
                            try {
                                return "function" == typeof a ? a(b) : b } catch (c) {
                                return A(c) } }

                        function f(a) {
                            if ("function" == typeof b) { e(a, h);
                                try {
                                    return b(a) } catch (c) {
                                    return A(c) } }
                            return A(a) }

                        function g(a) {
                            return "function" == typeof c ? c(a) : a }
                        var h = this,
                            i = m(),
                            j = !1;
                        return l.nextTick(function() { h.promiseDispatch(function(a) { j || (j = !0, i.resolve(d(a))) }, "when", [function(a) { j || (j = !0, i.resolve(f(a))) }]) }), h.promiseDispatch(void 0, "when", [void 0, function(a) {
                            var b, c = !1;
                            try { b = g(a) } catch (d) {
                                if (c = !0, !l.onerror) throw d;
                                l.onerror(d) }
                            c || i.notify(b) }]), i.promise }, l.tap = function(a, b) {
                        return l(a).tap(b) }, p.prototype.tap = function(a) {
                        return a = l(a), this.then(function(b) {
                            return a.fcall(b).thenResolve(b) }) }, l.when = q, p.prototype.thenResolve = function(a) {
                        return this.then(function() {
                            return a }) }, l.thenResolve = function(a, b) {
                        return l(a).thenResolve(b) }, p.prototype.thenReject = function(a) {
                        return this.then(function() {
                            throw a }) }, l.thenReject = function(a, b) {
                        return l(a).thenReject(b) }, l.nearer = r, l.isPromise = s, l.isPromiseAlike = t, l.isPending = u, p.prototype.isPending = function() {
                        return "pending" === this.inspect().state }, l.isFulfilled = v, p.prototype.isFulfilled = function() {
                        return "fulfilled" === this.inspect().state }, l.isRejected = w, p.prototype.isRejected = function() {
                        return "rejected" === this.inspect().state };
                    var fa = [],
                        ga = [],
                        ha = [],
                        ia = !0;
                    l.resetUnhandledRejections = x, l.getUnhandledReasons = function() {
                        return fa.slice() }, l.stopUnhandledRejectionTracking = function() { x(), ia = !1 }, x(), l.reject = A, l.fulfill = B, l.master = D, l.spread = E, p.prototype.spread = function(a, b) {
                        return this.all().then(function(b) {
                            return a.apply(void 0, b) }, b) }, l.async = F, l.spawn = G, l["return"] = H, l.promised = I, l.dispatch = J, p.prototype.dispatch = function(a, b) {
                        var c = this,
                            d = m();
                        return l.nextTick(function() { c.promiseDispatch(d.resolve, a, b) }), d.promise }, l.get = function(a, b) {
                        return l(a).dispatch("get", [b]) }, p.prototype.get = function(a) {
                        return this.dispatch("get", [a]) }, l.set = function(a, b, c) {
                        return l(a).dispatch("set", [b, c]) }, p.prototype.set = function(a, b) {
                        return this.dispatch("set", [a, b]) }, l.del = l["delete"] = function(a, b) {
                        return l(a).dispatch("delete", [b]) }, p.prototype.del = p.prototype["delete"] = function(a) {
                        return this.dispatch("delete", [a]) }, l.mapply = l.post = function(a, b, c) {
                        return l(a).dispatch("post", [b, c]) }, p.prototype.mapply = p.prototype.post = function(a, b) {
                        return this.dispatch("post", [a, b]) }, l.send = l.mcall = l.invoke = function(a, b) {
                        return l(a).dispatch("post", [b, Y(arguments, 2)]) }, p.prototype.send = p.prototype.mcall = p.prototype.invoke = function(a) {
                        return this.dispatch("post", [a, Y(arguments, 1)]) }, l.fapply = function(a, b) {
                        return l(a).dispatch("apply", [void 0, b]) }, p.prototype.fapply = function(a) {
                        return this.dispatch("apply", [void 0, a]) }, l["try"] = l.fcall = function(a) {
                        return l(a).dispatch("apply", [void 0, Y(arguments, 1)]) }, p.prototype.fcall = function() {
                        return this.dispatch("apply", [void 0, Y(arguments)]) }, l.fbind = function(a) {
                        var b = l(a),
                            c = Y(arguments, 1);
                        return function() {
                            return b.dispatch("apply", [this, c.concat(Y(arguments))]) } }, p.prototype.fbind = function() {
                        var a = this,
                            b = Y(arguments);
                        return function() {
                            return a.dispatch("apply", [this, b.concat(Y(arguments))]) } }, l.keys = function(a) {
                        return l(a).dispatch("keys", []) }, p.prototype.keys = function() {
                        return this.dispatch("keys", []) }, l.all = K, p.prototype.all = function() {
                        return K(this) }, l.any = L, p.prototype.any = function() {
                        return L(this) }, l.allResolved = k(M, "allResolved", "allSettled"), p.prototype.allResolved = function() {
                        return M(this) }, l.allSettled = N, p.prototype.allSettled = function() {
                        return this.then(function(a) {
                            return K(_(a, function(a) {
                                function b() {
                                    return a.inspect() }
                                return a = l(a), a.then(b, b) })) }) }, l.fail = l["catch"] = function(a, b) {
                        return l(a).then(void 0, b) }, p.prototype.fail = p.prototype["catch"] = function(a) {
                        return this.then(void 0, a) }, l.progress = O, p.prototype.progress = function(a) {
                        return this.then(void 0, void 0, a) }, l.fin = l["finally"] = function(a, b) {
                        return l(a)["finally"](b) }, p.prototype.fin = p.prototype["finally"] = function(a) {
                        return a = l(a), this.then(function(b) {
                            return a.fcall().then(function() {
                                return b }) }, function(b) {
                            return a.fcall().then(function() {
                                throw b }) }) }, l.done = function(a, b, c, d) {
                        return l(a).done(b, c, d) }, p.prototype.done = function(a, c, d) {
                        var f = function(a) { l.nextTick(function() {
                                    if (e(a, g), !l.onerror) throw a;
                                    l.onerror(a) }) },
                            g = a || c || d ? this.then(a, c, d) : this; "object" == typeof b && b && b.domain && (f = b.domain.bind(f)), g.then(void 0, f) }, l.timeout = function(a, b, c) {
                        return l(a).timeout(b, c) }, p.prototype.timeout = function(a, b) {
                        var c = m(),
                            d = setTimeout(function() { b && "string" != typeof b || (b = new Error(b || "Timed out after " + a + " ms"), b.code = "ETIMEDOUT"), c.reject(b) }, a);
                        return this.then(function(a) { clearTimeout(d), c.resolve(a) }, function(a) { clearTimeout(d), c.reject(a) }, c.notify), c.promise }, l.delay = function(a, b) {
                        return void 0 === b && (b = a, a = void 0), l(a).delay(b) }, p.prototype.delay = function(a) {
                        return this.then(function(b) {
                            var c = m();
                            return setTimeout(function() { c.resolve(b) }, a), c.promise }) }, l.nfapply = function(a, b) {
                        return l(a).nfapply(b) }, p.prototype.nfapply = function(a) {
                        var b = m(),
                            c = Y(a);
                        return c.push(b.makeNodeResolver()), this.fapply(c).fail(b.reject), b.promise }, l.nfcall = function(a) {
                        var b = Y(arguments, 1);
                        return l(a).nfapply(b) }, p.prototype.nfcall = function() {
                        var a = Y(arguments),
                            b = m();
                        return a.push(b.makeNodeResolver()), this.fapply(a).fail(b.reject), b.promise }, l.nfbind = l.denodeify = function(a) {
                        var b = Y(arguments, 1);
                        return function() {
                            var c = b.concat(Y(arguments)),
                                d = m();
                            return c.push(d.makeNodeResolver()), l(a).fapply(c).fail(d.reject), d.promise } }, p.prototype.nfbind = p.prototype.denodeify = function() {
                        var a = Y(arguments);
                        return a.unshift(this), l.denodeify.apply(void 0, a) }, l.nbind = function(a, b) {
                        var c = Y(arguments, 2);
                        return function() {
                            function d() {
                                return a.apply(b, arguments) }
                            var e = c.concat(Y(arguments)),
                                f = m();
                            return e.push(f.makeNodeResolver()), l(d).fapply(e).fail(f.reject), f.promise } }, p.prototype.nbind = function() {
                        var a = Y(arguments, 0);
                        return a.unshift(this), l.nbind.apply(void 0, a) }, l.nmapply = l.npost = function(a, b, c) {
                        return l(a).npost(b, c) }, p.prototype.nmapply = p.prototype.npost = function(a, b) {
                        var c = Y(b || []),
                            d = m();
                        return c.push(d.makeNodeResolver()), this.dispatch("post", [a, c]).fail(d.reject), d.promise }, l.nsend = l.nmcall = l.ninvoke = function(a, b) {
                        var c = Y(arguments, 2),
                            d = m();
                        return c.push(d.makeNodeResolver()), l(a).dispatch("post", [b, c]).fail(d.reject), d.promise }, p.prototype.nsend = p.prototype.nmcall = p.prototype.ninvoke = function(a) {
                        var b = Y(arguments, 1),
                            c = m();
                        return b.push(c.makeNodeResolver()), this.dispatch("post", [a, b]).fail(c.reject), c.promise }, l.nodeify = P, p.prototype.nodeify = function(a) {
                        return a ? void this.then(function(b) { l.nextTick(function() { a(null, b) }) }, function(b) { l.nextTick(function() { a(b) }) }) : this }, l.noConflict = function() {
                        throw new Error("Q.noConflict only works when Q is used as a global") };
                    var ja = j();
                    return l }) }).call(this, b("_process")) }, { _process: 14 }],
        16: [function(a, b, c) {
            var d = a("btoa"),
                e = (a("atob"), a("crypto-js/hmac-sha256")),
                f = a("crypto-js/enc-base64");
            a("crypto-js/enc-utf8");
            b.exports = function(a, b, c, g) {
                var h = { applicationKey: a, identity: { type: "username", endpoint: c.username }, created: g || (new Date).toISOString(), expiresIn: 86400 },
                    i = JSON.stringify(h).replace(" ", ""),
                    j = d(i),
                    k = e(i, f.parse(b)),
                    l = k.toString(f),
                    m = j + ":" + l;
                return { userTicket: m } } }, { atob: 2, btoa: 4, "crypto-js/enc-base64": 8, "crypto-js/enc-utf8": 9, "crypto-js/hmac-sha256": 10 }],
        17: [function(a, b, c) {
            function Notification(a, b, c, d) { this.progress = a / b, this.message = c, this.object = d }

            function d() {
                var a, b = navigator.userAgent,
                    c = b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || b.match(/(applewebkit(?=\/))\/?\s*(\d+)/i) || [];
                return /trident/i.test(c[1]) ? (a = /\brv[ :]+(\d+)/g.exec(b) || [], "IE " + (a[1] || "")) : "Chrome" === c[1] && (a = b.match(/\bOPR\/(\d+)/), null != a) ? "Opera " + a[1] : (c = c[2] ? [c[1], c[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (a = b.match(/version\/(\d+)/i)) && c.splice(1, 1, a[1]), c.join("/").substring(0, 50)) }

            function e() {
                return navigator.platform }

            function f(a) {
                if (!a) throw new TypeError("Could not create SinchClient, configuration not provided.");
                if (a.capabilities = a.capabilities || {}, "string" != typeof a.applicationKey) throw new TypeError("Could not create SinchClient, applicationKey is not a string");
                this.capabilities = a.capabilities, this._appKey = a.applicationKey || "", this._appSecret = a.applicationSecret || void 0, this._sessionId = "", this._sessionSecret = "", this._logHandler = a.onLogMessage || function() {}, this._logMxpHandler = a.onLogMxpMessage || function() {}, this._onlineCapability = a.startActiveConnection || a.supportActiveConnection || !1, this._autoStartMxp = a.startActiveConnection || !1, this._expiresIn = a.expiresIn || 86400, this._subInstanceId = Math.round(Math.random() * Math.pow(2, 32)), this._customStream = a.customStream || void 0, this._supportVideo = a.capabilities.video || !1, this._multiCall = a.capabilities.multiCall || !1, this.applicationKey = this._appKey, this.firefox = !1, "undefined" != typeof navigator && (this.firefox = (navigator || { userAgent: "" }).userAgent.indexOf("Firefox") > 0), this._url = { base: "https://api.sinch.com/v1/", user: "https://userapi.sinch.com/v1/", portal: "https://portalapi.sinch.com/v1/", reporting: "https://reportingapi.sinch.com/v1/", reporting_v2: "https://reportingapi.sinch.com/v2/", calling: "https://callingapi.sinch.com/v1/", messaging: "https://messagingapi.sinch.com/v1/", verification: "https://api.sinch.com/verification/v1/" }, this.setUrl(a.urlObj || {}), this.loadPAPIUrl(), this.loadTimeDelta(), this.user = new o(this), "messaging" in this.capabilities && this.capabilities.messaging && (this.messageClient = new n(this)), "calling" in this.capabilities && this.capabilities.calling && (this.callClient = new i(this, a.customStream)), "stealth" in this.capabilities && this.capabilities.stealth && (this.callClient = new i(this, a.customStream)) }

            function g(a, b, c) {
                this.sinch = a, this.eventListeners = [], this.callId = c || A(), this.callDomain = "None", this.callOutbound = void 0, this.fromId = "", this.toId = "", this.sinch.firefox ? this.webRtcConfig = { iceServers: [{ url: "stun:23.21.150.121" }, { url: "stun:stun.l.google.com:19302" }] } : this.webRtcConfig = { iceServers: [{ url: "stun:23.21.150.121" }, { url: "stun:stun.l.google.com:19302" }] };
                var f = navigator.userAgent.match(/Chrom[e|ium]\/([0-9]+)\./),
                    g = f ? parseInt(f[1], 10) : !1,
                    h = navigator.userAgent.match(/Firefox\/([0-9]+)\./),
                    i = h ? parseInt(h[1], 10) : !1;
                (g >= 48 || i >= 42) && (this.sinch.log(new Notification(0, 1, "Chrome >= 48 or FF >= 42 detected, will generate certificate manually for better compatibility")), C.generateCertificate({ name: "ECDSA", namedCurve: "P-256" }).then(function(a) { this.sinch.log(new Notification(0, 1, "New certificate generated and configured!")), this.webRtcConfig.certificates = [a] }.bind(this))), this.outgoingStream = void 0, this.outgoingStreamURL = void 0, this.incomingStream = void 0, this.incomingStreamURL = void 0, this.earlymedia = void 0, this.callState = G.INITIATING, this.callEndCause = H.NONE, this.timeProgressing = null, this.timeEstablished = null, this.timeEnded = null, this.error = null, this.autoAnswer = !1, this.autoHangup = !1, this.videoSupport = b || !1, this.clientMap = {}, this.sdpMap = {}, this.iceMapRx = {}, this.iceMapTx = [], this.activeInstance = void 0, this.pcMap = {}, this.dataChannels = {}, this.proxyUrl = void 0, this.customHeaders = void 0, this.sdpAnswerBuffer = {}, this.joinBuffer = {};
                var j = { onCallEnded: function(a) { this.sinch.mxp.unsubscribe("signalPubNub") }.bind(this) };
                this.addEventListener(j);
                var k = "web",
                    l = "0";
                try { k = d().split("/")[0], l = d().split("/")[1] } catch (m) {}
                var n = {
                    onCallEnded: function(b) {
                        var c = b.getDetails();
                        if (c.startedTime) {
                            var d = {
                                callId: b.callId,
                                domain: b.callDomain,
                                outbound: b.callOutbound,
                                fromId: b.fromId,
                                toId: b.toId,
                                callTime: new Date(c.startedTime).toISOString(),
                                duration: c.duration,
                                setupDuration: (b.timeEstablished - b.timeProgressing) / 1e3 || 0,
                                result: b.callEndCause,
                                deviceInformation: { ModelId: e() || "unknown", OSName: k, OSVersion: l, SDKPlatform: "js", SDKPlatformVersion: a.getVersion() }
                            };
                            b.sinch.callReporting(d).fail(function() { console.error("Could not report call!") })
                        }
                        b.ffIceTimer && clearInterval(b.ffIceTimer)
                    }
                };
                this.addEventListener(n)
            }

            function h(a) { this.endCause = a.endCause, this.endedTime = a.endedTime, this.error = a.error, this.establishedTime = a.establishedTime, this.startedTime = a.startedTime, this.duration = a.duration }

            function i(a, b) {
                if (!(a instanceof f)) throw new Error("CallClient can't be instantiated, use getCallClient in an SinchClient instance");
                var c = navigator.userAgent.toLowerCase();
                if (c.indexOf("msie") > -1 || /Apple Computer/.test(navigator.vendor)) throw new Error("SinchClient can't be started with calling capability. Browser not supported.");
                this.sinch = a, this.eventListeners = [], this.callBuffert = {}, this.localMediaStream = void 0, this.incomingCallCustomStream = b, this.groupChannel = void 0 }

            function j(a, b, c) {
                if (!(a instanceof f)) throw new SinchError(w.ErrorDomainVerification, x.VerificationInvalidInput, "Invalid input to constructor. VerificationClient can not be instantiated, use createSmsVerification in an SinchClient instance", error);
                if ("undefined" == typeof b || 0 == b.toString().length) throw new SinchError(w.ErrorDomainVerification, x.VerificationInvalidInput, "Invalid input to constructor. Valid phone number required (E.164 format ideally)", b);
                this.sinch = a, this.number = b || null, this.custom = c || null, this.flagVerified = !1 }

            function k(a, b) { this.sinch = a, this.callClient = a.callClient, this.groupChannel = b, this.eventListeners = [], this.callBuffert = [], this.callListeners = { onCallProgressing: function(a) { this.sinch.log(new Notification(0, 1, "Call progressing", a)) }.bind(this), onCallEstablished: function(a) { this.sinch.log(new Notification(0, 1, "Call established", a)), this.execListener("onGroupRemoteCallAdded", a) }.bind(this), onCallEnded: function(a) { this.sinch.log(new Notification(0, 1, "Call ended", a)), this.execListener("onGroupRemoteCallRemoved", a) }.bind(this) }, this.groupListener = { onIncomingCall: function(a) { a.addEventListener(this.callListeners), setTimeout(function() { a.answer() }, 450 * Object.keys(this.callBuffert).length + Math.random()) }.bind(this) }, this.callClient.addEventListener(this.groupListener), this.sinch.callClient.initStream().then(function(a) { this.sinch.log(new Notification(0, 1, "Media stream successfully created", a)), this.execListener("onGroupLocalMediaAdded", a), this.sinch.mxp.broadcastPubNub.publish({ channel: b, message: this.sinch.user.userId }), this.sinch.mxp.subscribeNotificationChannel(b) }.bind(this)), this.sinch.onnotification = function(a, c) { b == a && c != this.sinch.user.userId && (this.sinch.log(new Notification(0, 1, "Will call user in group, after random timeout", c)), setTimeout(function() {
                        var a = this.callClient.callUser(c);
                        this.callBuffert.push(a), a.addEventListener(this.callListeners) }.bind(this), 300 + Math.round(500 * Math.random()))) }.bind(this) }

            function l(a, b) {
                if (this.delivered = [], this.direction = !b, a instanceof r) { this.messageId = a.mxpSessionId;
                    var c = JSON.parse(a.decrypted.bd);
                    this.textBody = c.t, this.recipientIds = a.recipientIds, this.senderId = a.decrypted.fu;
                    try { this.headers = a.decrypted.nvps.ph } catch (d) {}
                    this.timestamp = new Date } else {
                    if (!(a instanceof Object)) throw new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Unsupported message parameters", a);
                    this.messageId = A(), this.recipientIds = a.recipientIds, this.textBody = a.textBody, this.senderId = a.senderId, this.headers = a.publicHeaders, this.timestamp = new Date } }

            function m(a, b) { this.messageId = b, this.recipientId = a, this.timestamp = new Date }

            function n(a) {
                if (!(a instanceof f)) throw new Error("MessageClient can't be instantiated, use getMessageClient in an SinchClient instance");
                this.sinch = a, this.eventListeners = [], this.messageBuffert = {}, this.ackBuffert = {}, this.onMessageDelivered = [], this.emptyLog(), this.messageLogInterval = setInterval(this.commitLog.bind(this), 3e4) }

            function SinchError(a, b, c, d) { this.name = "SinchError", this.domain = a || -1, this.code = b || 0, this.response = d || {}, this.message = c || "General sinch error", this.stack = new Error(c).stack }

            function o(a) { this.userObj = {}, this.sinch = a }

            function p(a, b, c) {
                if (!(a instanceof f)) throw new SinchError(w.ErrorDomainVerification, x.VerificationInvalidInput, "Invalid input to constructor. VerificationClient can not be instantiated, use createSmsVerification in an SinchClient instance", error);
                if ("undefined" == typeof b || 0 == b.toString().length) throw new SinchError(w.ErrorDomainVerification, x.VerificationInvalidInput, "Invalid input to constructor. Valid phone number required (E.164 format ideally)", b);
                this.sinch = a, this.number = b || null, this.custom = c || null, this.flagVerified = !1 }

            function q(a) { this.sinch = a, this.user = a.user, this.rtcConfiguration = a.user.mxpConfig.rtcConfiguration, this.rtcProfile = a.user.mxpConfig.rtcProfile, PUBNUB.offline(), this.broadcastPubNub = PUBNUB({ publish_key: this.rtcConfiguration.broadcastNetwork.publishKey, subscribe_key: this.rtcConfiguration.broadcastNetwork.subscribeKey, ssl: !0, origin: this.rtcConfiguration.broadcastNetwork.host }), this.signalPubNub = PUBNUB({ publish_key: this.rtcConfiguration.signalNetwork.publishKey, subscribe_key: this.rtcConfiguration.signalNetwork.subscribeKey, ssl: !0, origin: this.rtcConfiguration.signalNetwork.host }), this.messageBuffert = {}, this.transportBuffert = {}, this.sessionBuffert = {}, this.unencryptedFrames = {}, this.broadcastPubNub.sinchStack = {}, this.broadcastPubNub.sinchStack[this.rtcProfile.broadcastChannel] = [], this.broadcastPubNub.sinchStack[this.rtcProfile.transportChannel] = [], this.signalPubNub.sinchStack = {}, this.signalPubNub.sinchStack[this.rtcProfile.signalChannel] = [] }

            function MXPError(a, b, c, d) { this.name = "MXPError", this.domain = a || -1, this.code = b || 0, this.response = d || {}, this.message = c || "General MXP error", this.stack = new Error(c).stack }

            function MXPLog(a, b) { this.message = a, this.object = b }

            function MXPIncoming(a, b) { this.handler = a, this.object = b }

            function MXPOutgoing(a, b) { this.handler = a, this.object = b }

            function r(a, b) { this.decrypted = {};
                for (var c in a)
                    if ("object" == typeof a[c]) { a[c] instanceof Array ? this[c] = [] : this[c] = {};
                        for (var d in a[c]) this[c][d] = a[c][d] } else this[c] = a[c];
                if (b instanceof g) { b.activeInstance && (this.decrypted.nvps = this.decrypted.nvps || {}, this.decrypted.nvps.to = b.activeInstance), this.txChannels = [];
                    for (var e in b.clientMap) "virtual" != e && -1 === this.txChannels.indexOf(b.clientMap[e].fs) && this.txChannels.push(b.clientMap[e].fs);
                    0 == this.txChannels.length && "virtual" in b.clientMap && this.txChannels.push(b.clientMap.virtual.fs), this.sub = "signalPubNub" } }

            function s(a, b, c, d) { this.name = "MXPError", this.domain = a || -1, this.code = b || 0, this.response = d || {}, this.message = c || "General MXP error", this.stack = new Error(c).stack }
            var t = a("q"),
                u = a("../VERSION"),
                v = a("sinch-ticketgen"),
                w = { ErrorDomainNone: -1, ErrorDomainNetwork: 0, ErrorDomainCapability: 1, ErrorDomainSession: 2, ErrorDomainApi: 3, ErrorDomainOther: 4, ErrorDomainSDK: 5, ErrorDomainVerification: 7 },
                x = { NoneNone: 0, NetworkConnectionRefused: 1e3, NetworkConnectionTimedOut: 1001, NetworkServerError: 1002, CapabilityUserNotFound: 2e3, CapabilityCapabilityMissing: 2001, CapabilityAuthenticationFailed: 2002, SessionFailedToInitiateSession: 3e3, SessionNoPendingSessionExists: 3001, SessionTransferCantBeInitiated: 3002, SessionActiveUserLimitReached: 3003, ApiApiCallFailed: 4e3, OtherInvalidOfflinePayloadTooBig: 5e3, OtherInvalidOfflineInvitePayloadFailedToDecode: 5001, OtherInvalidOfflineInviteUnknownType: 5002, OtherOther: 5003, SDKUnexpectedCall: 6e3, SDKInternalError: 6001, SDKInternalOther: 6002, SDKMissingParameter: 6003, SDKMissingCallback: 6004, VerificationInvalidInput: 7001, VerificationServiceError: 7002, VerificationIncorrectCode: 7003, VerificationFailedToInterceptCode: 7004, VerificationUnexpectedInitiateError: 7005 },
                y = function(a) {
                    var b = t.defer(),
                        c = new XMLHttpRequest;
                    c.onload = function() {
                        if (c.status >= 200 && c.status < 300) {
                            try { c.response = c.response || c.responseText, c.data = JSON.parse(c.response || "{}") } catch (a) { console.log("Cant parse JSON" + c.response) }
                            b.resolve(c.data) } else {
                            try { c.response = c.response || c.responseText, c.data = JSON.parse(c.response || "{}") } catch (a) { console.log("Cant parse JSON" + c.response) }
                            b.reject(c) } }, c.onerror = function() { b.reject(new Error("Unsupported operation " + c.status, c)) }, c.open(a.method, a.url, !0);
                    for (var d in a.headers) c.setRequestHeader(d, a.headers[d]);
                    return c.send(JSON.stringify(a.data)), b.promise },
                z = function(a, b) {
                    var c = { method: a.method, headers: { "Content-Type": "application/json; charset=UTF-8", Accept: "application/json, text/plain, */*" } }; "GET" != a.method && (c.data = b), c.url = "";
                    for (var d in a.urlParts) {
                        if (":" === a.urlParts[d][0]) {
                            var e = a.urlParts[d].slice(1);
                            c.url += encodeURIComponent((b || {})[e]).replace(/%2B/g, "+").replace(/%40/g, "@") } else c.url += a.urlParts[d];
                        d < a.urlParts.length - 1 && (c.url += "/") }
                    switch (a.auth) {
                        case "sign":
                            c.headers = this.signSession(c);
                            break;
                        case "nosign":
                            c.headers = this.signApp(c);
                            break;
                        case "ticket":
                            c.headers = this.signTicket(c), delete c.data.authorization;
                            break;
                        case "signorticket":
                            this._sessionId ? c.headers = this.signSession(c) : (c.headers = this.signTicket(c), delete c.data.authorization);
                            break;
                        default:
                            throw new Error("Unsupported authentication type: " + a.auth) }
                    if ("GET" === a.method && b && Object.keys(b).length > 0 && !a.hideQueryParams) { c.url += "?";
                        for (var f in b) c.url += encodeURIComponent(f) + "=" + encodeURIComponent(b[f]) + "&" }
                    return y(c) },
                A = function() {
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
                        var b = 16 * Math.random() | 0,
                            c = "x" == a ? b : 3 & b | 8;
                        return c.toString(16) }) },
                B = B || {};
            B.base = { getServerTime: { url: "timestamp/", method: "GET", auth: "nosign" }, getInstance: { url: "instance", method: "POST", auth: "ticket" }, renewInstance: { url: "instance", method: "POST", auth: "sign" }, renewSecret: { url: "instances/id/:instanceId/authorization", method: "PUT", auth: "ticket" }, getInstances: { url: "instances/id/", method: "GET", auth: "sign" } };
            var B = B || {};
            B.calling = { getConfiguration: { url: "configuration/user", method: "GET", auth: "sign" }, placeCall: { url: "calls/:domain", method: "POST", auth: "sign" }, callReporting: { url: "calls/:domain/id/:callId", method: "PUT", auth: "sign" }, postMedia: { url: "media", method: "POST", auth: "sign" } };
            var B = B || {};
            B.messaging = { getTransportById: { url: "transport", method: "GET", auth: "sign" }, getTransportByParticipants: { url: "transport", method: "POST", auth: "sign" }, messageReporting: { url: "report/im", method: "POST", auth: "sign" }, pushMessage: { url: "push/messages", method: "POST", auth: "sign" } };
            var B = B || {};
            B.user = { authenticate: { url: "users/email/:email/authentication", method: "POST", auth: "nosign" }, authenticateUsername: { url: "users/username/:username/authentication", method: "POST", auth: "nosign" }, authenticateNumber: { url: "users/number/:number/authentication", method: "POST", auth: "nosign" }, createUser: { url: "users", method: "POST", auth: "nosign" }, changePassword: { url: "user/password", method: "PUT", auth: "sign" }, updateUser: { url: "user/profile", method: "PATCH", auth: "sign" }, getUserProfile: { url: "user/profile", method: "GET", auth: "sign" } };
            var B = B || {};
            B.verification = { verifyUserSMS: { url: "verifications", method: "POST", auth: "sign" }, confirmUserSMS: { url: "verifications/number/:number", method: "PUT", auth: "sign" }, confirmUserCallout: { url: "verifications", method: "POST", auth: "sign" }, queryVerificationById: { url: "verifications/callout/number/:number", method: "GET", hideQueryParams: !0, auth: "sign" } }, f.prototype.loadPAPIUrl = function() { this.PAPI = JSON.parse(JSON.stringify(B));
                for (var a in B)
                    for (var b in B[a]) this.PAPI[a][b].urlParts = (this._url[a] + this.PAPI[a][b].url).split("/"), this[b] = z.bind(this, this.PAPI[a][b]) }, f.prototype.loadTimeDelta = function() {
                var a = t.defer();
                return this.timeDelta ? a.resolve() : this.getServerTime().then(function(b) {
                    var c = new Date(b.timestamp),
                        d = new Date;
                    this.timeDelta = c - d, a.resolve() }.bind(this))["catch"](function(b) { console.error(b), a.fail(b) }), a.promise }, f.prototype.config = function(a) { this._appKey = a.appKey || this._appKey, this._sessionId = a.sessionId || this._sessionId, this._sessionSecret = a.sessionSecret || this._sessionSecret, localStorage["SinchSDK-" + this._appKey + "-" + this.user.userId] = this._sessionId }, f.prototype.loadSessionId = function() { this._sessionId = localStorage["SinchSDK-" + this._appKey + "-" + this.user.userId] || "" }, f.prototype.log = function(a, b) { b && b.notify(a), this._logHandler(a) }, f.prototype.logMxp = function(a) { this._logMxpHandler(a) }, f.prototype.setUrl = function(a) { this._url.user = a.user || this._url.user, this._url.base = a.base || this._url.base, this._url.portal = a.portal || this._url.portal, this._url.reporting = a.reporting || this._url.reporting, this._url.reporting_v2 = a.reporting_v2 || this._url.reporting_v2, this._url.calling = a.calling || this._url.calling, this._url.messaging = a.messaging || this._url.messaging, this._url.verification = a.verification || this._url.verification, this.loadPAPIUrl() }, f.prototype.terminate = function() {
                try { this.mxp && this.mxp.close(), this.mxp.destroy(), this.mxp && delete this.mxp, this._sessionId = "", this._sessionSecret = "", this.messageClient && this.messageClient.destroy() } catch (a) {} }, f.prototype.stop = function() { console.error("Stop is deprecated, use terminate() instead!"), this.terminate() }, f.prototype.adjustedTime = function() {
                var a = (new Date).getTime();
                return new Date(a + (this.timeDelta || 0)).toISOString() }, f.prototype.signSession = function(a) {
                try {
                    var b = "";
                    if (void 0 !== a.data) {
                        var c = "string" != typeof a.data ? JSON.stringify(a.data) : a.data;
                        b = V.MD5(c).toString(V.enc.Base64) }
                    a.headers["Content-Type"] = (a.headers["Content-Type"] || "").replace("utf-8", "UTF-8").replace("/json;chars", "/json; chars"), a.headers["X-Timestamp"] = a.headers["X-Timestamp"] || this.adjustedTime();
                    var d = "" + a.method + "\n" + b + "\n" + (a.headers["Content-Type"] || "") + "\nx-timestamp:" + a.headers["X-Timestamp"] + "\n" + a.url.match(/^https?:\/\/[^\/]+([^#]*)/)[1];
                    if (this._sessionId.length > 0 && this._sessionSecret.length > 0) {
                        var e = V.HmacSHA256(V.enc.Utf8.parse(d), V.enc.Base64.parse(this._sessionSecret)).toString(V.enc.Base64);
                        a.headers.Authorization = "instance " + this._sessionId + ":" + e } else a.headers.Authorization = "application " + this._appKey;
                    return a.headers } catch (f) {
                    throw f }
                return null }, f.prototype.signTicket = function(a, b) {
                return b = b || a.data.authorization, a.headers = a.headers || {}, a.headers.Authorization = "user " + b, a.headers["X-Timestamp"] = this.adjustedTime(), a.headers }, f.prototype.signApp = function(a) {
                try {
                    return a.headers["X-Timestamp"] = a.headers["X-Timestamp"] || this.adjustedTime(), a.headers.Authorization = "application " + this._appKey, a.headers } catch (b) {
                    throw b }
                return null }, f.prototype.getSession = function() {
                return { userId: this.user.userId, sessionId: this._sessionId, sessionSecret: this._sessionSecret } }, f.prototype.newUser = function(a, b, c) {
                var d = t.defer();
                return b = b || function(a) {
                    return console.info("User successfully created"), a }, c = c || function(a) { console.error(a) }, this.user.create(a).then(b).then(d.resolve).fail(function(a) { this.log(a), c(a), d.reject(a) }.bind(this)), d.promise }, f.prototype.start = function(a, b, c) {
                var d = t.defer();
                if (b = b || function() { this.log(new Notification(0, 1, "SinchClient started")) }.bind(this), c = c || function(a) { console.error(a) }, this.started) {
                    var e = new Error("Sinch client already started");
                    c(e), d.reject(e) } else this.started = !0, this.loadTimeDelta().then(function(a) {
                    return this.log(new Notification(0, 5, "Get authentication token"), d), this.user.authenticate(a) }.bind(this, a), a).then(function(a) {
                    return this.loadSessionId(), a }.bind(this)).then(function(a) {
                    return this.log(new Notification(1, 5, "Get instance using auth token"), d), a && a.sessionId && a.sessionSecret ? this.user.resumeSession(a) : this.user.initSessKeySecret() }.bind(this)).fail(function(a) {
                    if (40400 === ((a || { response: {} }).response || {}).errorCode) return this.log(new Notification(1, 5, "Invalid instance. Will try again without any pre-set instance ID."), d), this._sessionId = "", this.user.initSessKeySecret();
                    throw a }.bind(this)).then(function() {
                    return this.log(new Notification(2, 5, "Get MXP configuration"), d), this.user.getMXPConf() }.bind(this)).then(function() { this.log(new Notification(3, 5, "Create MXP object"), d), this.mxp = new q(this) }.bind(this)).then(function() {
                    return !this._autoStartMxp || "undefined" == typeof this.messageClient && "undefined" == typeof this.callClient ? void this.log(new Notification(4, 5, "Will NOT start active connection. This will prevent IM and incoming data calls."), d) : (this.log(new Notification(4, 5, "Will start active connection"), d), this.startActiveConnection()) }.bind(this)).then(b).then(function() { this.log(new Notification(5, 5, "Successfully started SinchClient"), d), d.resolve() }.bind(this)).fail(function(a) { this.started = !1, this._sessionId = "", this._sessionSecret = "", this.log(a), c(a), d.reject(a) }.bind(this));
                return d.promise }, f.prototype.getMessageClient = function() {
                if ("messaging" in this.capabilities && this.capabilities.messaging) return this.messageClient;
                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "No messaging capability, not possible to retrieve messageClient") }, f.prototype.getCallClient = function() {
                if ("calling" in this.capabilities && this.capabilities.calling) return this.callClient;
                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "No calling capability, not possible to retrieve callClient") }, f.prototype.createSmsVerification = function(a, b) {
                return new p(this, a, b) }, f.prototype.createCalloutVerification = function(a, b) {
                return new j(this, a, b) }, f.prototype.startActiveConnection = function() {
                if (this._onlineCapability && this.started) return this.log(new Notification(4, 5, "Manually starting active connection")), this.mxp.init();
                if (!this._onlineCapability) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, 'No online capability, can not start active connection. Set configuration option "supportActiveConnection" to "true" when instantiating the SinchClient');
                this._autoStartMxp = !0 }, f.prototype.stopActiveConnection = function() {
                if (this._onlineCapability) return this.log(new Notification(4, 5, "Manually closing active connection")), this.mxp.close();
                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, 'No online capability, can not start active connection. Set configuration option "supportActiveConnection" to "true" when instantiating the SinchClient') }, f.prototype.getVersion = function() {
                try {
                    return u.version[1] } catch (a) {
                    return "dev" } }, f.prototype.onnotification = function(a, b) {};
            var C, D, E, F = F || {};
            C = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || F.RTCPeerConnection, D = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || F.RTCSessionDescription, E = window.mozRTCIceCandidate || window.RTCIceCandidate || F.RTCIceCandidate, g.prototype.addEventListener = function(a) { this.eventListeners.push(a) }, g.prototype.removeEventListener = function(a) { this.eventListeners.splice(this.eventListeners.indexOf(a), 1) }, g.prototype.setStream = function(a) { this.outgoingStream = a, this.outgoingStreamURL = window.URL.createObjectURL(a) }, g.prototype.execListener = function(a, b) { this.eventListeners.forEach(function(c) {
                    try {
                        return c[a] && c[a](this, b) } catch (d) {
                        var e = new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error executing listener: " + a, d);
                        throw console.error(e), e } }.bind(this)) }, g.prototype.setEndCause = function(a) { this.callEndCause === H.NONE && (this.callEndCause = a) }, g.prototype.setParticipants = function(a, b) { this.callOutbound = a == this.sinch.user.userId, this.toId = b, this.fromId = a }, g.prototype.progress = function(a) {
                if (this.callState != G.INITIATING) throw new SinchError(w.ErrorDomainOther, x.OtherOther, "Progress: Invalid call state for progressing", g);
                this.sinch.log(new Notification(0, 1, "Call changing state to PROGRESSING")), this.timeProgressing = new Date, this.callState = G.PROGRESSING, a && this.execListener("onCallProgressing"), this.autoAnswer && this.answer(), this.autoHangup && this.hangup() }, g.prototype.establish = function() {
                if (this.callState == G.PROGRESSING) { this.sinch.log(new Notification(0, 1, "Call changing state to ESTABLISHED")), this.pc = this.pc || this.pcMap[this.activeInstance] || this.pcMap.virtual, delete this.pcMap.virtual;
                    for (var a in this.pcMap) a != this.activeInstance && this.pcMap[a] != this.pcMap[this.activeInstance] && (this.pcMap[a] && "closed" != this.pcMap[a].signalingState && this.pcMap[a].close(), delete this.pcMap[a]); "connection" != this.callDomain && (this.unmute(), this.incomingStream = this.pc.getRemoteStreams()[0], this.incomingStreamURL = window.URL.createObjectURL(this.incomingStream)), this.timeEstablished = new Date, this.callState = G.ESTABLISHED, this.execListener("onCallEstablished") } else console.log("Call state not in PROGRESSING, cant process second JOIN") }, g.prototype.mxpAck = function(a) {
                if (this.sinch.log(new Notification(0, 1, "Call ACK Received", a)), this.callState != G.INITIATING && this.callState != G.PROGRESSING) throw new SinchError(w.ErrorDomainOther, x.OtherOther, "Invalid call state for processing Ack", g);
                this.clientMap[a.getSenderId()] = this.clientMap[a.getSenderId()] || a.getFrom();
                for (var b = 0; b < this.iceMapTx.length; b++) {
                    var c = this.iceMapTx[b];
                    this.sinch.log(new Notification(0, 1, "Firefox special: Transmitting buffered ICE candidates for the one Peer Connection we have.", c)), this.sinch.mxp.callTxICECandidate(this, c, a.fi).fail(function(a) {
                        throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending ICE candidate") }) } "sdp" === a.decrypted.bt ? this.processRTCAnswer(a).then(function() { "yes" === (a.decrypted.nvps || {}).earlymedia ? (this.activeInstance = a.getSenderId(), this.progress(!1), this.establish(), this.earlymedia = !0) : this.progress(!0), this.joinBuffer[a.getSenderId()] && (this.sinch.log(new Notification(0, 1, "Buffered JOIN was detected for this Ack, will immediatley process & remove.")), this.mxpJoin(this.joinBuffer[a.getSenderId()]), delete this.joinBuffer[a.getSenderId()]) }.bind(this)) : this.callState == G.INITIATING && this.progress(!0) }, g.prototype.intProcessAnswer = function(a, b) {
                var c = t.defer();
                this.sinch.log(new Notification(2, 2, "Will configure SDP Answer", a));
                var d = this.pcMap[b];
                return d.setRemoteDescription(a, function() { this.sinch.log(new Notification(2, 2, "Configured incoming SDP Answer", a)), c.resolve() }.bind(this), function(a) {
                    throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error setting remote SDP", a) }.bind(this)), c.promise }, g.prototype.processRTCAnswer = function(a) {
                var b = t.defer();
                if (this.callState != G.ENDED) {
                    var c = a.decrypted.bd;
                    this.sinch.log(new Notification(0, 2, "Processing SDP Answer from B", c));
                    var d = new D(JSON.parse(c));
                    if (this.sinch.firefox) this.pcMap[a.getSenderId()] = this.offerGeneratorPC, this.sdpAnswerBuffer[a.getSenderId()] = d, b.resolve();
                    else { this.pcMap[a.getSenderId()] = this.pcMap[a.getSenderId()] || this.initPC();
                        var e = this.pcMap[a.getSenderId()];
                        e.createOffer(function(c) { e.setLocalDescription(this.outgoingOffer, function() { this.sinch.log(new Notification(1, 2, "Configured cached outgoing SDP Offer", this.outgoingOffer)), this.intProcessAnswer(d, a.getSenderId()).then(function() { b.resolve() }) }.bind(this), function(a) { console.error("Error setting local Description, message: " + a) }) }.bind(this), function(a) { console.error("Error creating offer, message: " + a) }, { offerToReceiveAudio: !0, offerToReceiveVideo: this.videoSupport }) } } else b.resolve();
                return b.promise }, g.prototype.mxpPeerEventSdp = function(a) {
                if (this.callState == G.INITIATING || this.callState == G.PROGRESSING) this.disableIce = !0, this.processRTCAnswer(a);
                else if (this.callState == G.ESTABLISHED) {
                    var b = JSON.parse(a.decrypted.bd);
                    if ("offer" == b.type) { this.sinch.log(new Notification(0, 3, "Got renegotiation SDP Offer", b));
                        var c = new D(b);
                        this.pc.setRemoteDescription(c, function() { this.sinch.log(new Notification(1, 3, "Successfully configured SDP Offer.", b)), this.pc.createAnswer(function(b) { this.pc.setLocalDescription(b, function() { this.sinch.log(new Notification(2, 3, "Successfully created SDP Answer.", b)), this.sinch.mxp.callTxPeerEventSDP(this, b, a.getSenderId()).fail(function(a) {
                                        throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending SDP Answer") }) }.bind(this), function(a) { console.error("Major error in setting local description", a) }) }.bind(this), function(a) { console.error("Major error in creating answer", a) }) }.bind(this), function(a) {
                            throw setTimeout(function() { this.setEndCause(H.FAILURE), this.error = new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, a), this.sinch.mxp.callCancel(this).fail(function(a) {
                                    throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending call Cancel") }), this.callFailure() }.bind(this), 2e3), new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error setting remote SDP") }.bind(this)) } else if ("answer" == b.type) { this.sinch.log(new Notification(0, 2, "Got renegotiation SDP Answer", b));
                        var c = new D(b);
                        this.pc.setRemoteDescription(c, function() { this.sinch.log(new Notification(1, 2, "Configured incoming SDP Answer", b)) }.bind(this), function(a) {
                            throw setTimeout(function() { this.setEndCause(H.FAILURE), this.error = new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, a), this.sinch.mxpCancel(this).fail(function(a) {
                                    throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending call Cancel") }), this.callFailure() }.bind(this), 2e3), new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error setting remote SDP") }) } } }, g.prototype.mxpInjectIce = function(a) {
                if (this.callState != G.ENDED) { this.sinch.log(new Notification(0, 2, "Recieved ICE Candidate offer from B", a));
                    var b = JSON.parse(a.decrypted.bd);
                    b.candidate = b.cand || b.candidate, b.sdpMLineIndex = b.sdpMLI || b.sdpMLineIndex;
                    var c = a.getSenderId();!this.sinch.firefox && c in this.pcMap ? (this.sinch.log(new Notification(0, 2, "Injecting ICE candidate directly", b)), this.injectIce(c, b)) : (this.sinch.log(new Notification(0, 2, "Buffering ICE candidate until PeerConnection created", b)), this.iceMapRx[c] = this.iceMapRx[c] || [], this.iceMapRx[c].push(b)) } }, g.prototype.injectIce = function(a, b) {
                var c = b.candidate.split(" ");
                if (-1 != c.indexOf("srflx") && "udp" == c[2].toLowerCase()) {
                    var d = ["candidate:" + (123 + (this.pcMap[a].proxyIce || []).length), c[1], c[2].toUpperCase(), Math.round(c[3] / 10), this.proxyUrl.split("/")[3].split(":")[0], this.proxyUrl.split("/")[3].split(":")[1], "typ", "relay", "raddr", c[4], "rport", c[5], "generation", 0],
                        e = { candidate: d.join(" "), sdpMLineIndex: "number" == typeof b.sdpMLI ? b.sdpMLI : b.sdpMLineIndex || 0, sdpMid: b.sdpMid };
                    this.sinch.log(new Notification(0, 1, "Generated extra candidate for Proxy Relay", e)), "undefined" == typeof this.pcMap[a].proxyIce && (this.pcMap[a].proxyIce = []), this.pcMap[a].proxyIce.push(new E(e)) }
                this.pcMap[a].addIceCandidate(new E(b), function() {}, function() {}) }, g.prototype.mxpJoin = function(a) {
                if (this.sinch.log(new Notification(0, 1, "Call JOIN Received", a)), this.activeInstance && this.activeInstance != a.getSenderId()) throw console.error("Can not process JOIN, call in session after previous JOIN"), new SinchError(w.ErrorDomainSession, x.SessionActiveUserLimitReached, "Can not process JOIN, call in session after previous JOIN");
                var b = a.getSenderId();
                this.callState == G.INITIATING ? (this.sinch.log(new Notification(0, 1, "JOIN received before ACK. Will cache JOIN to process after ACK.")), this.joinBuffer[b] = a) : t.fcall(function() {
                    var c = t.defer();
                    if (this.sinch.firefox && this.sdpAnswerBuffer[b]) {
                        var d = this.sdpAnswerBuffer[b];
                        this.intProcessAnswer(d, a.getSenderId()).then(function() {
                            for (;
                                (this.iceMapRx[b] || []).length;) {
                                var d = this.iceMapRx[b].pop();
                                this.injectIce(a.getSenderId(), d), this.sinch.log(new Notification(0, 1, "Injected ice from Ice Rx buffert", d)) }
                            setTimeout(function() { c.resolve() }.bind(this), 200) }.bind(this)) } else c.resolve();
                    return c.promise }.bind(this)).then(function() {
                    if (0 == ((this.pcMap[b] || {}).proxyIce || []).length)
                        if (console.error("Warning, no proxy configured (1). Will try to add candidate without srflx reference", this.pcMap[b]), this.proxyUrl) {
                            var c = this.proxyUrl.split("/")[3].split(":");
                            this.pcMap[b].proxyIce = this.pcMap[b].proxyIce || [], this.pcMap[b].proxyIce.push(new E({ sdpMid: "audio", sdpMLI: 0, sdpMLineIndex: 0, candidate: K.generateIceCandidate(c[0], c[1]) })) } else console.error("Warning, no proxyUrl configured!");
                    if (((this.pcMap[b] || {}).proxyIce || []).forEach(function(a) { this.sinch.log(new Notification(0, 1, "Adding buffered proxy ICE candidate", a)), this.pcMap[b].addIceCandidate(a, function() { this.sinch.log(new Notification(0, 1, "Successfully added proxy ICE candidate", a)) }.bind(this), function(a) {
                                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Failed to add proxy ICE candidate when processing JOIN", a) }) }.bind(this)), this.callState != G.PROGRESSING && !this.earlymedia) throw console.error("Can not process JOIN, call in unexpected state. Call state: " + this.getState()), new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Can not process JOIN, call in unexpected state.");
                    this.activeInstance = a.getSenderId(), this.sinch.mxp.callJoined(this).then(function() { this.sinch.log(new Notification(0, 1, "Successfully sent JOINED", this)), this.earlymedia || this.establish() }.bind(this)).fail(function(a) { console.error("Unhandled error in call.mxpJoin.", a) }) }.bind(this)).fail(function(a) { console.error("Error processing JOIN", a) }) }, g.prototype.mxpJoined = function(a) {
                if (this.sinch.log(new Notification(0, 1, "Call JOINED Received", a)), this.callState == G.INITIATING || this.callState == G.PROGRESSING) {
                    var b = JSON.parse(a.decrypted.bd);
                    if (b.fi != this.sinch._sessionId + ":" + this.sinch._subInstanceId) this.setEndCause(H.OTHER_DEVICE_ANSWERED), this.mxpHangup();
                    else if (this.callState == G.PROGRESSING) {
                        var c = a.getSenderId();
                        if (this.sinch.firefox)
                            for (;
                                (this.iceMapRx[c] || []).length;) {
                                var d = this.iceMapRx[c].pop();
                                this.injectIce(a.getSenderId(), d), this.sinch.log(new Notification(0, 1, "Injected ice from Ice Rx buffert", d)) }
                        if (0 == ((this.pcMap[c] || {}).proxyIce || []).length)
                            if (console.error("Warning, no proxy configured (2). Will try to add candidate without srflx reference", this.pcMap[c]), this.proxyUrl) {
                                var e = this.proxyUrl.split("/")[3].split(":");
                                this.pcMap[c].proxyIce = this.pcMap[c].proxyIce || [], this.pcMap[c].proxyIce.push(new E({ sdpMid: "audio", sdpMLI: 0, sdpMLineIndex: 0, candidate: K.generateIceCandidate(e[0], e[1]) })) } else console.error("Warning, no proxyUrl configured!");
                            ((this.pcMap[c] || {}).proxyIce || []).forEach(function(a) { this.sinch.log(new Notification(0, 1, "Adding buffered proxy ICE candidate", a)), this.pcMap[c].addIceCandidate(a, function() { this.sinch.log(new Notification(0, 1, "Successfully added proxy ICE candidate", a)) }.bind(this), function(a) {
                                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Failed to add proxy ICE candidate when processing JOINED", a) }) }.bind(this)), this.establish() } } else console.log("Call state already ESTABLISHED (or ENDED), cant process second JOIN") }, g.prototype.mxpHangup = function(a) {
                if (this.callState != G.ENDED) { this.sinch.log(new Notification(0, 1, "Call HANGUP Received", a)), this.callState == G.ESTABLISHED ? this.setEndCause(H.HUNG_UP) : this.setEndCause(H.CANCELED), this.timeEnded = new Date, this.callState = G.ENDED, this.execListener("onCallEnded"), this.pc && "closed" != this.pc.signalingState && this.pc.close(), delete this.pc;
                    for (var b in this.pcMap) delete this.pcMap[b] } }, g.prototype.mxpDeny = function(a) {
                if (this.callState != G.ENDED) {
                    if (this.sinch.log(new Notification(0, 1, "Call DENIED Received", a)), this.setEndCause(H.DENIED), "error/json" == a.decrypted.bt) { this.error = new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, "");
                        var b = JSON.parse(a.decrypted.bd);
                        for (var c in b) this.error[c] = b[c];
                        this.error.message = b.code + " " + b.reason, this.error.mxp = a.decrypted }
                    this.callState == G.INITIATING ? (this.autoHangup = !0, this.progress(!0)) : this.hangup() } }, g.prototype.mxpCancel = function(a) {
                if (this.callState != G.ENDED) { this.sinch.log(new Notification(0, 1, "Call CANCEL Received", a)), this.timeEnded = new Date, this.callState = G.ENDED;
                    Date.now();
                    this.setEndCause(H.CANCELED), this.execListener("onCallEnded"), this.pc && "closed" != this.pc.signalingState && this.pc.close(), delete this.pc;
                    for (var b in this.pcMap) delete this.pcMap[b] } }, g.prototype.mxpFail = function(a) {
                if (this.sinch.log(new Notification(0, 1, "Call FAILURE Received", a)), "message" == a.decrypted.bt) this.error = new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, ""), this.error.message = a.decrypted.bd, this.error.mxp = a.decrypted;
                else if ("error/json" == a.decrypted.bt) { this.error = new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, "");
                    var b = JSON.parse(a.decrypted.bd);
                    for (var c in b) this.error[c] = b[c];
                    this.error.message = b.code + " " + b.reason, this.error.mxp = a.decrypted }
                this.callFailure() }, g.prototype.callFailure = function() {
                this.timeEnded = new Date, this.callState = G.ENDED, this.setEndCause(H.FAILURE), this.execListener("onCallEnded"), this.pc && "closed" != this.pc.signalingState && this.pc.close(),
                    delete this.pc;
                for (var a in this.pcMap) delete this.pcMap[a]
            }, g.prototype.addEventListenerPrototype = function(a) { a.onOpen && (this.onopen = a.onOpen), a.onClose && (this.onclose = a.onClose), a.onMessage && (this.onmessage = a.onMessage) }, g.prototype.initPC = function(a) {
                var b = new C(this.webRtcConfig, { optional: [{ DtlsSrtpKeyAgreement: !0 }] });
                return this.outgoingStream && "connection" != this.callDomain ? (this.mute(), b.addStream(this.outgoingStream)) : (this.sinch.log(new Notification(0, 1, "WebRTC: Will add data channel before ICE negotiation")), this.dataChannels[this.sinch.user.userId] = b.createDataChannel(this.sinch.user.userId, { reliable: !1 }), this.dataChannels[this.sinch.user.userId].onmessage = function(a) { console.log("fallback", a) }, this.dataChannels[this.sinch.user.userId].addEventListener = this.addEventListenerPrototype.bind(this.dataChannels[this.sinch.user.userId])), b.onaddstream = function(a) {}.bind(this), b.ondatachannel = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: Datachannel opened", a));
                    try { this.dataChannels[a.channel.label] = a.channel, this.dataChannels[a.channel.label].addEventListener = this.addEventListenerPrototype.bind(this.dataChannels[a.channel.label]), this.execListener("onDataChannelAdded", this.dataChannels[a.channel.label]) } catch (b) { console.error("Error handling datachannel", b) } }.bind(this), b.oniceconnectionstatechange = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: Connection state changed", a)), this.renegotiate || !a.currentTarget || "failed" != a.currentTarget.iceConnectionState && "disconnected" != a.currentTarget.iceConnectionState || (this.sinch.log(new SinchError(w.ErrorDomainNetwork, x.NetworkConnectionTimedOut, "Ice connection failed. Hanging up call!", a)), this.hangup()) }.bind(this), b.onicecandidate = function(a) {
                    if (!this.renegotiate && a.candidate) { this.sinch.log(new Notification(0, 2, "Preparing ICE candidate for B", a.candidate));
                        var c = Object.keys(this.pcMap).filter(function(a) {
                                return this.pcMap[a] === b }.bind(this))[0],
                            d = { cand: a.candidate.candidate, candidate: a.candidate.candidate, sdpMLI: a.candidate.sdpMLineIndex, sdpMLineIndex: a.candidate.sdpMLineIndex, sdpMid: a.candidate.sdpMid || "" };
                        setTimeout(function() { c ? this.disableIce ? this.sinch.log(new Notification(1, 2, "ICE Disabled, will not send any ICE candidates (will be sent in different way)", d)) : (this.sinch.log(new Notification(1, 2, "Instantly sending ICE candidate for B", d)), this.sinch.mxp.callTxICECandidate(this, d, c).fail(function(a) {
                                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending ICE candidate") })) : this.iceMapTx.push(d) }.bind(this), this.sinch.mxp.sessionBuffert[this.callId] ? 0 : 500) } }.bind(this), b.onnegotiationneeded = function(a) { this.callState == G.ESTABLISHED && (this.renegotiate = !0, this.sinch.log(new Notification(0, 2, "Negotiation needed, will generate new offer", a)), b.createOffer(function(a) { this.sinch.log(new Notification(1, 2, "Negotiation needed, offer generated", a)), b.setLocalDescription(a, function() { this.sinch.log(new Notification(1, 2, "Negotiation needed, sending offer to recipient", a)), this.sinch.mxp.callTxPeerEventSDP(this, a, this.activeInstance).fail(function(a) {
                                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending SDP Offer") }) }.bind(this)) }.bind(this))) }.bind(this), b.onremovestream = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: Stream removed", a)) }.bind(this), b.onsignalingstatechange = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: Signaling state change", a)) }.bind(this), b.onidentityresult = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: onidentityresult event detected", a)) }, b.onidpassertionerror = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: onidpassertionerror event detected", a)) }, b.onidpvalidationerror = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: onidpvalidationerror event detected", a)) }, b.onpeeridentity = function(a) { this.sinch.log(new Notification(0, 1, "WebRTC: onpeeridentity event detected", a)) }, b }, g.prototype.placeCall = function(a, b) {
                var c = t.defer();
                this.callDomain = b, this.setParticipants(this.sinch.user.userId, a), setTimeout(function() { this.callState == G.INITIATING && (this.sinch.log(new Notification(0, 1, "Call PROGRESSING timeout. Will hangup call.", this)), this.setEndCause(H.TIMEOUT), this.hangup()) }.bind(this), I), setTimeout(function() { this.callState == G.PROGRESSING && (this.sinch.log(new Notification(0, 1, "Call ESTABLISHED timeout. Will hangup call.", this)), this.setEndCause(H.NO_ANSWER), this.hangup()) }.bind(this), J);
                var d = { pstn: "number", data: "username", conference: "username", connection: "username", sip: "username" },
                    e = { pstn: "pstn", data: "data", conference: "conference", connection: "data", sip: "sip" },
                    f = { cli: "", destination: { type: d[b], endpoint: a }, callId: this.callId, mediaChannels: ["audio"], subinstanceId: this.sinch._subInstanceId, headers: { p2p: "yes" }, domain: e[b] };
                this.sinch._supportVideo && f.mediaChannels.push("video"), this.customHeaders && (f.headers.ph = JSON.stringify(this.customHeaders)), "connection" == b && (f.headers.nomedia = !0);
                var g = this.initPC();
                return g.createOffer(function(b) { this.outgoingOffer = b, f.sdp = b, this.sinch.placeCall(f).then(function(d) { this.sinch.log(new Notification(0, 1, "Successfully initiated call, waiting for MXP signalling.", d)), void 0 !== d.SignalChannel && null !== d.SignalChannel && (this.clientMap.virtual = { fs: d.SignalChannel, fu: a }), this.proxyUrl = d.Body.replace(/(\r\n|\n|\r)/gm, ""), this.sinch.firefox && (this.offerGeneratorPC = g, g.setLocalDescription(b, function() { this.sinch.log(new Notification(0, 1, "Firefox special: Configuring the local description to gather ICE candidates.", b)) }.bind(this), function(a) {
                            throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Firefox special: Error configuring local description", a) })), this.sinch.mxp.configureMxpSession(this.callId, d.EncryptionKey, d.Body), c.resolve() }.bind(this)).fail(function(a) { this.error = new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, JSON.parse(a.response).message), this.callFailure(), c.reject(error) }.bind(this)) }.bind(this), function(a) { console.error("Failed to generate SDP Offer"), console.error(a) }, { offerToReceiveAudio: !0, offerToReceiveVideo: this.videoSupport }), c.promise }, g.prototype.ackIncomingCall = function(a) {
                var b = t.defer();
                this.sinch.log(new Notification(0, 1, "Incoming call", this)), setTimeout(function() { this.callState == G.INITIATING && (this.sinch.log(new Notification(0, 1, "Call PROGRESSING timeout. Will hangup call.", this)), this.setEndCause(H.TIMEOUT), this.hangup()) }.bind(this), I), setTimeout(function() { this.callState == G.PROGRESSING && (this.sinch.log(new Notification(0, 1, "Call ESTABLISHED timeout. Will hangup call.", this)), this.setEndCause(H.NO_ANSWER), this.hangup()) }.bind(this), J);
                var c = JSON.parse(a.decrypted.nvps.sdp);
                this.sinch.log(new Notification(0, 1, "Received SDP offer from B", c));
                var d = new D(c),
                    e = this.initPC();
                return this.pcMap[a.getSenderId()] = e, this.pc = e, e.setRemoteDescription(d, function() {
                    for (this.sinch.log(new Notification(1, 3, "Successfully configured SDP Offer.", c));
                        (this.iceMapRx[this.activeInstance] || []).length;) {
                        var b = this.iceMapRx[this.activeInstance].pop();
                        this.injectIce(a.getSenderId(), b), this.sinch.log(new Notification(0, 1, "Injected ice from Ice Rx buffert", b)) }
                    e.createAnswer(function(b) { e.setLocalDescription(b, function() {
                            if (this.sinch.log(new Notification(2, 3, "Successfully created SDP Answer.", b)), this.progress(!1), this.sinch.firefox) {
                                var c = { candidate: "candidate:123123 1 UDP 1 127.0.0.1 3000 typ host", sdpMLI: 0, sdpMLineIndex: 0, sdpMid: "audio" };
                                this.sinch.log(new Notification(0, 1, "Firefox special: Will setup fake candidate injection interval.", c)), this.ffInjectCounter = 0, this.ffIceTimer = setInterval(function() { this.sinch.log(new Notification(0, 1, "Firefox special: Injecting fake candidate number: " + this.ffInjectCounter, c)), this.ffInjectCounter += 1, this.ffInjectCounter > 2 && (this.sinch.log(new Notification(0, 1, "Firefox special: Done injecting fake candidates.", this)), clearInterval(this.ffIceTimer)), this.pc.addIceCandidate(new E(c), function() {}, function() {}) }.bind(this), 15e3), this.pc.addIceCandidate(new E(c), function() {}, function() {}) }
                            if ("yes" == a.decrypted.nvps.p2p) this.sinch.log(new Notification(2, 3, "Header detected, p2p, will proceed with direct peer connection!.", a)), this.sinch.mxp.sendSdpAnswer(this, b).fail(function(a) {
                                throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending SDP Answer") });
                            else { this.disableIce = !0, this.sinch.log(new Notification(2, 3, "p2p header not detected, will fall back on proxy, we might deal with an old client", a)), this.mediaObj = { callid: this.callId, proxyid: a.decrypted.bd.split("/")[2], sdp: b }, this.sinch.mxp.sendSdpAnswer(this);
                                var d = a.decrypted.bd.split("/")[3].split(":");
                                e.proxyIce = e.proxyIce || [], e.proxyIce.push(new E({ sdpMid: "audio", sdpMLI: 0, sdpMLineIndex: 0, candidate: K.generateIceCandidate(d[0], d[1]) })) } }.bind(this), function(a) { console.error("Major error in setting local description", a) }) }.bind(this), function(a) { console.error("Major error in creating answer", a) }) }.bind(this), function(a) {
                    throw setTimeout(function() { this.setEndCause(H.FAILURE), this.error = new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, a), this.sinch.mxp.callCancel(this).fail(function(a) {
                            throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending call Cancel") }), this.callFailure() }.bind(this), 2e3), new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error setting remote SDP") }.bind(this)), b.promise }, g.prototype.answer = function() {
                if (this.sinch.log(new Notification(0, 1, "Answer call initiated, to answer()", this)), this.callState == G.PROGRESSING) this.mediaObj ? this.sinch.postMedia(this.mediaObj).then(function(a) {
                    var b = "audio:ISAC/0.0.0.0/" + a.proxyid + "/" + a.ip + ":" + a.port;
                    this.sinch.mxp.joinIncomingCall(this, b).then(function() { this.sinch.log(new Notification(3, 3, "Successfully sent updated proxy information in Ack to caller", b)) }.bind(this)).fail(function(a) {
                        throw console.error(a), new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Could not send Ack to Old with MEDIA answer") }) }.bind(this)).fail(function(a) {
                    throw console.error(a), new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Could not send Answer to v1/media") }) : this.sinch.mxp.joinIncomingCall(this).fail(function(a) {
                    throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending JOIN (pickup phone).") });
                else if ("undefined" == typeof outgoingStream) this.sinch.log(new Notification(0, 1, "Outgoing stream undefined, perhaps early answer. Will set auto answer for future automatic answer.")), this.autoAnswer = !0;
                else {
                    if (this.callState == G.ENDED || this.callState == G.ESTABLISHED) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Call in invalid state to answer.");
                    this.sinch.log(new Notification(0, 1, "Stream defined and state in initializing or progressing. Setting auto answer for later retry.")), this.autoAnswer = !0 } }, g.prototype.openDataChannel = function(a) {
                return "undefined" == typeof this.dataChannels[a] && (this.dataChannels[a] = this.pcMap[this.activeInstance].createDataChannel(a, { reliable: !1 }), this.dataChannels[a].addEventListener = this.addEventListenerPrototype.bind(this.dataChannels[a]), this.execListener("onDataChannelAdded", this.dataChannels[a])), this.dataChannels[a] }, g.prototype.hangup = function() {
                if (this.hangupRetries = (this.hangupRetries || 0) + 1, this.callState == G.ESTABLISHED) this.sinch.mxp.callHangup(this).fail(function(a) {
                    throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending call Hangup") }), this.mxpHangup();
                else if (!this.callOutbound || this.callState != G.PROGRESSING && this.callState != G.INITIATING)
                    if (this.callOutbound || this.callState != G.PROGRESSING && this.callState != G.INITIATING) {
                        if (this.callState == G.ENDED) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Call already ended");
                        this.mxpHangup() } else this.callState == G.PROGRESSING ? (this.sinch.mxp.callDeny(this).fail(function(a) {
                        throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending call Deny") }), this.setEndCause(H.DENIED), this.mxpHangup()) : this.autoHangup = !0;
                else Object.keys(this.clientMap).length > 0 || this.hangupRetries > 5 ? (this.sinch.mxp.callCancel(this).fail(function(a) {
                    throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error sending call Cancel") }), this.mxpHangup()) : (this.sinch.log(new Notification(0, 1, "Can not hang up call at this time. Will try again in 0.5 seconds (max five retries).")), setTimeout(this.hangup.bind(this), 500)) }, g.prototype.getCallId = function() {
                return this.callId }, g.prototype.getDetails = function() {
                var a = new h({ endCause: this.callEndCause, endedTime: this.timeEnded, error: this.error, establishedTime: this.timeEstablished, startedTime: this.timeProgressing, duration: this.timeEstablished ? (this.timeEnded - this.timeEstablished) / 1e3 : 0 });
                return a }, g.prototype.getDirection = function() {
                return this.callOutbound ? 1 : 0 }, g.prototype.getRemoteUserId = function() {
                return this.getDirection() ? this.toId : this.fromId }, g.prototype.getState = function() {
                return Object.keys(G).filter(function(a) {
                    return G[a] === this.callState }.bind(this))[0] }, g.prototype.getEndCause = function() {
                return Object.keys(H).filter(function(a) {
                    return H[a] === this.callEndCause }.bind(this))[0] }, g.prototype.getHeaders = function() {
                return this.customHeaders }, g.prototype.sendDTMF = function(a) {
                return this.DTMFsender || (this.DTMFsender = this.pc.createDTMFSender(this.outgoingStream.getAudioTracks()[0])), this.DTMFsender && this.DTMFsender.insertDTMF(a) }, g.prototype.mute = function() {
                if (this.callState != G.ESTABLISHED && this.callState != G.PROGRESSING && this.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Call not in ESTABLISHED state.");
                this.sinch.log(new Notification(0, 1, "Call was muted using mute()."));
                for (var a = this.outgoingStream.getAudioTracks(), b = 0; b < a.length; b++) a[b].enabled = !1 }, g.prototype.unmute = function() {
                if (this.callState != G.ESTABLISHED && this.callState != G.PROGRESSING && this.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Call not in ESTABLISHED state.");
                this.sinch.log(new Notification(0, 1, "Call was un-muted using unmute()."));
                for (var a = this.outgoingStream.getAudioTracks(), b = 0; b < a.length; b++) a[b].enabled = !0 }, navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia, i.prototype.addEventListener = function(a) { this.eventListeners.push(a) }, i.prototype.removeEventListener = function(a) { this.eventListeners.splice(this.eventListeners.indexOf(a), 1) }, i.prototype.execListener = function(a, b) {
                var c = 0;
                return this.eventListeners.forEach(function(d) {
                    return c++, d[a] && d[a](b) }.bind(this)), c }, i.prototype.initStream = function(a, b) {
                var c = t.defer(),
                    d = this.sinch._supportVideo && !b ? { mandatory: { maxWidth: 320, maxHeight: 240 } } : !1;
                return void 0 !== a ? (this.sinch.log(new Notification(0, 1, "Will wire customStream into call", a)), c.resolve(a)) : void 0 === this.localMediaStream ? (this.sinch.log(new Notification(0, 1, "Will retrieve new Mic for stream")), navigator.getUserMedia({ video: d, audio: !0 }, function(a) { this.localMediaStream = a, c.resolve(this.localMediaStream) }.bind(this), function(a) { console.error("Error retrieving media stream", a) })) : (this.sinch.log(new Notification(0, 1, "Will retrieve cached Mic for stream", this.localMediaStream)), c.resolve(this.localMediaStream)), c.promise }, i.prototype.alreadyInCall = function() {
                if (this.sinch._multiCall) return !1;
                for (var a in this.callBuffert)
                    if (this.callBuffert[a].callState == G.PROGRESSING || this.callBuffert[a].callState == G.ESTABLISHED) return !0 }, i.prototype.handleIncomingCall = function(a) { this.sinch.log(new Notification(0, 1, "Will handle incoming call", a));
                var b = new g(this.sinch, this.sinch._supportVideo, a.mxpSessionId);
                (a.decrypted.nvps || {}).nomedia ? b.callDomain = "connection" : b.callDomain = "data", b.setParticipants(a.decrypted.fu, this.sinch.user.userId), b.customHeaders = JSON.parse((a.decrypted.nvps || {}).ph || "{}"), this.sinch.mxp.configureMxpSession(b.callId, a.decrypted.nvps.key, a.decrypted.bd), b.clientMap[a.getSenderId()] = a.getFrom(), this.callBuffert[b.callId] = b, this.alreadyInCall() ? (this.sinch.log(new Notification(0, 1, "Already in a call, will hangup incoming call.", a)), this.sinch.mxp.subscribe("signalPubNub").then(function() { this.sinch.mxp.callDeny(b) }.bind(this))) : this.execListener("onIncomingCall", b) ? ("connection" == b.callDomain ? function() {
                    var a = t.defer();
                    return a.resolve(null), a.promise }() : this.initStream(this.incomingCallCustomStream)).then(function(c) {
                    return this.sinch.mxp.subscribe("signalPubNub").then(function() {
                        (a.decrypted.nvps || {}).nomedia || b.setStream(c), b.activeInstance = a.getSenderId(), b.proxyUrl = a.decrypted.bd.replace(/(\r\n|\n|\r)/gm, ""), b.ackIncomingCall(a)["catch"](function(a) { console.error("Error handling incoming call", a) }) }.bind(this)) }.bind(this)) : this.sinch.log(new SinchError(w.ErrorDomainSDK, x.SDKMissingCallback, "Missing handler, onIncomingCall.")) }, i.prototype.callUser = function(a, b, c) { this.sinch.log(new Notification(0, 1, "CallUser method called", a));
                var d = new g(this.sinch, this.sinch._supportVideo);
                return d.customHeaders = b, this.initStream(c).then(function(b) {
                    return this.sinch.mxp.subscribe("signalPubNub").then(function() {
                        if (d.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error executing user call. Incorrect call state.");
                        d.setStream(b), d.placeCall(a, "data"), this.callBuffert[d.callId] = d }.bind(this)) }.bind(this)), d }, i.prototype.callSip = function(a, b, c) { this.sinch.log(new Notification(0, 1, "CallSip method called", a));
                var d = new g(this.sinch);
                return d.customHeaders = b, this.initStream(c).then(function(b) {
                    return this.sinch.mxp.subscribe("signalPubNub").then(function() {
                        if (d.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error executing user call. Incorrect call state.");
                        d.setStream(b), d.placeCall(a, "sip"), this.callBuffert[d.callId] = d }.bind(this)) }.bind(this)), d }, i.prototype.connect = function(a, b) { this.sinch.log(new Notification(0, 1, "connect method called", a));
                var c = new g(this.sinch);
                return c.customHeaders = b, this.sinch.mxp.subscribe("signalPubNub").then(function() {
                    if (c.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error executing connect. Incorrect call state.");
                    c.placeCall(a, "connection"), this.callBuffert[c.callId] = c }.bind(this)), c }, i.prototype.callPhoneNumber = function(a, b, c) { this.sinch.log(new Notification(0, 1, "CallPhoneNumber method called", a));
                var d = new g(this.sinch);
                return d.customHeaders = b, this.initStream(c, !0).then(function(b) {
                    return this.sinch.mxp.subscribe("signalPubNub").then(function() {
                        if (d.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error executing user call. Incorrect call state.");
                        d.setStream(b), d.placeCall(a, "pstn"), this.callBuffert[d.callId] = d }.bind(this)) }.bind(this)), d }, i.prototype.callConference = function(a, b, c) {
                if (this.sinch.log(new Notification(0, 1, "CallConference method called", a)), a = "" + a, !a || a.length > 64) throw new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Invalid conferenceId. Must be alphanumeric string less than 64 characters in length.");
                var d = new g(this.sinch);
                return d.customHeaders = b, this.initStream(c, !0).then(function(b) {
                    return this.sinch.mxp.subscribe("signalPubNub").then(function() {
                        if (d.callState != G.INITIATING) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Error executing user call. Incorrect call state.");
                        d.setStream(b), d.placeCall(a, "conference"), this.callBuffert[d.callId] = d }.bind(this)) }.bind(this)), d }, i.prototype.callGroup = function(a) {
                if (this.sinch.log(new Notification(0, 1, "callRoom method called, for group", a)), "undefined" != typeof this.groupChannel) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Can not call room, already in a room");
                if (!this.sinch._multiCall) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Can not call room, multiCall capability not specified");
                return this.groupChannel = a, new k(this.sinch, a) };
            var G = { INITIATING: 0, PROGRESSING: 1, ESTABLISHED: 2, ENDED: 3, TRANSFERRING: 4 },
                H = { NONE: 0, TIMEOUT: 1, CANCELED: 6, DENIED: 2, FAILURE: 4, HUNG_UP: 5, NO_ANSWER: 3, OTHER_DEVICE_ANSWERED: 7, TIMEOUT: 1, TRANSFERRED: 8 },
                I = 10500,
                J = 45e3,
                K = function() {};
            K.generateIceCandidate = function(a, b) {
                return "a=candidate:" + Math.random().toString(36).substring(5) + " 1 UDP 2130706431 " + a + " " + b + " typ relay\r\n" }, j.prototype.initiate = function(a, b) {
                var c = t.defer();
                if (this.flagVerified) {
                    var f = new SinchError(w.ErrorDomainVerification, x.VerificationUnexpectedInitiateError, "Verification already verified, can't perform another callout.");
                    c.reject(f) } else {
                    var g = { identity: { type: "number", endpoint: this.number }, custom: this.custom, method: "callout", metadata: { os: d(), platform: e(), sdk: "js/" + this.sinch.getVersion() } };
                    this.sinch.log(new Notification(0, 1, "Will initiate callout verification using object", g)), this.sinch.confirmUserCallout(g).then(function(d) {
                        var e = this;
                        e.sinch.log(new Notification(0, 1, "Successfully initiated callout verification with response", d));
                        var f = 0,
                            g = function() { e.sinch.queryVerificationById({ number: e.number }).then(function(h) {
                                    switch (e.sinch.log(new Notification(0, 1, "Poll result after " + f + "s", h)), h.status) {
                                        case "SUCCESSFUL":
                                            e.sinch.log(new Notification(0, 1, "Successfully verified number after " + f + "s")), a && a(), c.resolve();
                                            break;
                                        case "PENDING":
                                            if (f += d.callout.pollingInterval, d.callout.pollingInterval > 0 && f < d.callout.stopPollingAfter) window.setTimeout(g, 1e3 * d.callout.pollingInterval);
                                            else {
                                                var i = new SinchError(w.ErrorDomainVerification, x.VerificationIncorrectCode, "Verification Failed, Timeout");
                                                b && b(i), c.reject(i) }
                                            break;
                                        case "FAIL":
                                        case "ERROR":
                                            e.sinch.log(new Notification(0, 1, "Verification failed after " + f + "s"));
                                            var i = new SinchError(w.ErrorDomainVerification, x.VerificationIncorrectCode, "Verification Failed, " + h.reason);
                                            b && b(i), c.reject(i);
                                            break;
                                        default:
                                            e.sinch.log(new Notification(0, 1, "Server response not handled at " + f + "s", h)) } }).fail(function(a) {
                                    var d;
                                    d = a.status ? new SinchError(w.ErrorDomainVerification, x.VerificationServiceError, "Could not poll verification status: " + a.statusText, a.responseText) : a, this.sinch.log(d), b && b(d), c.reject(d) }) };
                        window.setTimeout(g, 1e3 * d.callout.startPollingAfter) }.bind(this)).fail(function(a) {
                        var d;
                        d = a.status ? new SinchError(w.ErrorDomainVerification, x.VerificationServiceError, "Could not request verification: " + a.statusText, a.responseText) : a, this.sinch.log(d), b && b(d), c.reject(d) }.bind(this)) }
                return c.promise }, k.prototype.addEventListener = function(a) { this.eventListeners.push(a) }, k.prototype.removeEventListener = function(a) { this.eventListeners.splice(this.eventListeners.indexOf(a), 1) }, k.prototype.execListener = function(a, b) {
                var c = 0;
                return this.eventListeners.forEach(function(d) {
                    return c++, d[a] && d[a](b) }.bind(this)), c }, k.prototype.hangupGroup = function() {
                if ("undefined" == typeof this.callClient.groupChannel) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalOther, "Can not leave room, not in a room");
                for (var a in this.callBuffert) this.callBuffert[a].hangup();
                this.callClient.removeEventListener(this.groupListener), this.callClient.groupChannel = void 0 }, l.prototype.getMXPMessageObj = function() {
                var a = new r;
                return a.mxpSessionId = this.messageId, a.decrypted = { bd: JSON.stringify({ t: this.textBody }) }, this.headers && (a.decrypted.nvps = { ph: this.headers }), a.recipientIds = this.recipientIds, a }, n.prototype.emptyLog = function() { this.logCounters = { version: "2.0", sent: 0, received: 0, failed: 0 } }, n.prototype.commitLog = function() {
                (this.logCounters.sent || this.logCounters.received || this.logCounters.failed) && (this.sinch.log(new Notification(0, 1, "Will post IM log to backend for statistics", this.logCounters)), this.sinch.messageReporting(this.logCounters).then(this.emptyLog.bind(this))) }, n.prototype.destroy = function() { this.commitLog(), clearInterval(this.messageLogInterval) }, n.prototype.handleMessage = function(a) { a.recipientIds = a.transportObj.participants.reduce(function(a, b) {
                    return a.push(b.destination.identity), a }.bind(this), []);
                var b, c = !1;
                return this.messageBuffert[a.mxpSessionId] ? b = this.messageBuffert[a.mxpSessionId] : (b = new l(a, a.decrypted.fu != this.sinch.user.userId), this.messageBuffert[b.messageId] = b, c = !0), b.passedToHandler ? !1 : (this.eventListeners.forEach(function(a) {
                    return b.passedToHandler = !0, a.onIncomingMessage && a.onIncomingMessage(b) }), c && this.ackBuffert[b.messageId] && (this.ackBuffert[b.messageId].forEach(function(a) { this.ackMsg(a, b.messageId) }.bind(this)), delete this.ackBuffert[b.messageId]), b.direction || this.logCounters.received++, !0) }, n.prototype.addEventListener = function(a) { this.eventListeners.push(a) }, n.prototype.removeEventListener = function(a) { this.eventListeners.splice(this.eventListeners.indexOf(a), 1) }, n.prototype.send = function(a, b, c) {
                var d = t.defer();
                if (this.sinch.log(new Notification(0, 1, "Send message method called"), d), !(a instanceof l)) throw new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Unsupported message parameters", a);
                return b = b || function(a) {
                    return a }, c = c || function(a) { console.error(a) }, t.fcall(function(a) {
                    if (void 0 === this.sinch.mxp) {
                        var b = new SinchError(w.ErrorDomainSDK, x.SDKUnexpectedCall, "Sinch is not ready yet");
                        throw d.reject(b), b }
                    if (a.sent) throw new SinchError(w.ErrorDomainSDK, x.SDKUnexpectedCall, "Message already sent");
                    return a.sent = !0, a }.bind(this), a).then(this.sinch.mxp.sendMessage.bind(this.sinch.mxp)).then(b).then(function() { this.logCounters.sent++ }.bind(this)).then(d.resolve).fail(function(a) { this.sinch.log(a), c(a), this.logCounters.failed++, d.reject(a) }.bind(this)).progress(function(a) { this.sinch.log(a), d.notify(a) }.bind(this)), d.promise }, n.prototype.ackMsg = function(a, b) { this.messageBuffert[b] && -1 === this.messageBuffert[b].delivered.indexOf(a) ? (this.sinch.log(new MXPLog("Recieved ack from " + a + " for message", b)), this.messageBuffert[b].delivered.push(a), this.eventListeners.forEach(function(c) {
                    return c.onMessageDelivered && c.onMessageDelivered(new m(a, b)) }.bind(this))) : (this.ackBuffert[b] || (this.ackBuffert[b] = []), this.ackBuffert[b].push(a), this.sinch.log(new MXPLog("Got ack for message with non-existing messageId, storing in ackBuffert", b))) }, n.prototype.newMessage = function(a, b, c) {
                if ("string" == typeof a && (a = [a]), "string" != typeof b) throw new SinchError(w.ErrorDomainSDK, x.SDKUnexpectedCall, "Message text must be a string (for cross device compatability). Please stringify any objects.");
                if (c && "string" != typeof c) throw new SinchError(w.ErrorDomainSDK, x.SDKUnexpectedCall, "Headers must be a string (for cross device compatability). Please stringify any objects.");
                return new l({ recipientIds: a, textBody: b, senderId: this.sinch.user.userId, publicHeaders: c }) }, SinchError.prototype = Error.prototype, o.prototype.updateUser = function(a) {
                var b = t.defer();
                return this.sinch.updateUser(a).then(function(a) { this.userObj = a, b.resolve(a) }.bind(this)).fail(function(a) { b.reject(a) }.bind(this)), b.promise }, o.prototype.create = function(a) {
                var b = t.defer(),
                    c = { password: a.password, identities: [] };
                return a.email && (c.profile = { contact: { email: a.email } }, c.identities.push({ type: "email", endpoint: a.email })), a.username && c.identities.push({ type: "username", endpoint: a.username }), a.number && c.identities.push({ type: "number", endpoint: a.number }), this.sinch.createUser(c).then(function(a) { this.userObj = a, this.userId = a.user.identities.reduce(function(a, b) {
                        return "username" === b.type ? b.endpoint : a + "" }, ""), b.resolve(a) }.bind(this)).fail(function(a) { b.reject(new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, a.data.errorCode + " " + a.data.message, a.data)) }), b.promise }, o.prototype.authenticate = function(a) {
                if ("object" != typeof a) throw new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, 'No valid identity or authentication ticket. If you are passing your own authentication tickets, ensure it is an object on the format {"userTicket":SOME_TICKET}', a);
                if (a.expiresIn = a.expiresIn || 86400, a.sessionId && a.sessionSecret) return a;
                var b = t.defer(),
                    c = "";
                if (this.sinch._appSecret) a = v(this.sinch._appKey, this.sinch._appSecret, a);
                else if ("email" in a) {
                    if (c = this.sinch.authenticate, "" == a.email) return b.reject(new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Email is empty", a)), b.promise } else if ("username" in a) {
                    if (c = this.sinch.authenticateUsername, "" == a.username) return b.reject(new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Username is empty", a)), b.promise } else if ("number" in a && (c = this.sinch.authenticateNumber, "" == a.number)) return b.reject(new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Number is empty", a)), b.promise;
                if (a.authorization || a.userTicket) {
                    if (a.userTicket && !a.user) {
                        var d = a.userTicket.split(":"),
                            e = JSON.parse(atob(d[0])); "username" === !e.identity.type && b.reject(new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "Username missing in userTicket JSON object.", a)), a.user = { identities: [e.identity] } }
                    this.userObj = a, this.userObj.authorization = a.authorization || a.userTicket, this.userId = a.user.identities.reduce(function(a, b) {
                        return "username" === b.type ? b.endpoint : a + "" }, ""), b.resolve() } else c ? c(a).then(function(a) { this.userObj = a, this.userId = a.user.identities.reduce(function(a, b) {
                        return "username" === b.type ? b.endpoint : a + "" }, ""), b.resolve() }.bind(this)).fail(function(a) { b.reject(new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, a.data.errorCode + " " + a.data.message, a.data)) }) : b.reject(new SinchError(w.ErrorDomainSDK, x.SDKMissingParameter, "No valid identity or authentication ticket", a));
                return b.promise }, o.prototype.initSessKeySecret = function() {
                var a = t.defer(),
                    b = {};
                b.version = { os: d() || "unknown", platform: e() || "unknown", sdk: "js/" + this.sinch.getVersion() }, b.services = { calling: [] }, this.sinch._onlineCapability && b.services.calling.push("online"), this.sinch.capabilities.messaging && b.services.calling.push("im"), this.sinch.capabilities.calling && (b.services.calling.push("voip"), b.services.calling.push("p2p"), b.services.calling.push("srtp")), b.authorization = this.userObj.authorization;
                var c = "" !== this.sinch._sessionId;
                return c && (b.instanceId = this.sinch._sessionId), b.expiresIn = 31536e3, this.sinch[c ? "renewSecret" : "getInstance"](b).then(function(b) { this.sinch.config({ sessionId: b.id, sessionSecret: b.secret }), a.resolve() }.bind(this)).fail(function(b) { this.sinch._sessionId = "", this.sinch._sessionSecret = "", a.reject(new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, b.data.errorCode + " " + b.data.message, b.data)) }.bind(this)), a.promise }, o.prototype.resumeSession = function(a) {
                var b = t.defer();
                return this.userId = a.userId, this.sinch.config(a), this.sinch.getUserProfile().then(function(a) { this.userObj = a, b.resolve() }.bind(this)).fail(function(a) { a instanceof SinchError ? b.reject(a) : b.reject(new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, a.data.errorCode + " " + a.data.message, a.data)) }), b.promise }, o.prototype.getMXPConf = function() {
                var a = t.defer();
                return this.sinch.getConfiguration().then(function(b) { this.mxpConfig = b, a.resolve() }.bind(this)).fail(function(b) { a.reject(new SinchError(w.ErrorDomainApi, x.ApiApiCallFailed, b.data.errorCode + " " + b.data.message, b.data)) }), a.promise }, p.prototype.request = function(a, b) {
                var c = t.defer();
                if (this.flagVerified) {
                    var f = new SinchError(w.ErrorDomainVerification, x.VerificationUnexpectedInitiateError, "Verification already verified, can't request new code.");
                    c.reject(f) } else {
                    var g = { identity: { type: "number", endpoint: this.number }, custom: this.custom, method: "sms", metadata: { os: d(), platform: e(), sdk: "js/" + this.sinch.getVersion() } };
                    this.sinch.verifyUserSMS(g).then(function(b) { a && a(), c.resolve() }.bind(this)).fail(function(a) {
                        var d;
                        d = a.status ? new SinchError(w.ErrorDomainVerification, x.VerificationServiceError, "Could not request verification: " + a.statusText, a.responseText) : a, b && b(d), c.reject(d) }.bind(this)) }
                return c.promise }, p.prototype.verify = function(a, b, c) {
                var d = t.defer();
                if (this.flagVerified) b && b(this.cachedResponse), d.resolve(this.cachedResponse);
                else {
                    var e = { number: this.number, source: "manual", sms: { code: a }, method: "sms" };
                    this.sinch.confirmUserSMS(e).then(function(a) { this.flagVerified = !0, this.cachedResponse = a, b && b(a), d.resolve(a) }.bind(this)).fail(function(a) {
                        var b;
                        b = a.status ? new SinchError(w.ErrorDomainVerification, x.VerificationIncorrectCode, "Could not verify code: " + a.statusText, a.responseText) : a, c && c(b), d.reject(b) }.bind(this)) }
                return d.promise }, p.prototype.initiate = function(a, b) {
                return this.request(a, b) }, p.prototype.retry = function(a, b) {
                return this.request(a, b) }, q.prototype.init = function() {
                return this.subscribe("broadcastPubNub") }, q.prototype.close = function() {
                var a = this.broadcastPubNub,
                    b = this.signalPubNub;
                return setTimeout(function() { a && a.offline(), b && b.offline() }.bind(this), 1e4), t.all([this.unsubscribe("broadcastPubNub"), this.unsubscribe("signalPubNub")]);
            }, q.prototype.destroy = function() { delete this.broadcastPubNub, delete this.signalPubNub }, q.prototype.subscribe = function(a) {
                var b = t.defer(),
                    c = { restore: !1, connect: function(a) { b.resolve() }.bind(this), channel: Object.keys(this[a].sinchStack), callback: this._onmessagePubNub.bind(this), disconnect: this._ondisconnectPubNub.bind(this), error: this._onerrorPubNub.bind(this) },
                    d = !0;
                for (var e in this[a].sinchStack) d &= 0 == this[a].sinchStack[e].length, this[a].sinchStack[e].push(!0);
                return d ? this[a].subscribe(c) : b.resolve(), b.promise }, q.prototype.subscribeNotificationChannel = function(a) {
                var b = t.defer(),
                    c = "broadcastPubNub";
                this[c].sinchStack[a] = [];
                var d = { restore: !1, connect: function(a) { b.resolve() }.bind(this), channel: a, callback: function(b) { this.sinch.onnotification(a, b) }.bind(this), disconnect: this._ondisconnectPubNub.bind(this), error: this._onerrorPubNub.bind(this) };
                return this[c].subscribe(d), b.promise }, q.prototype.unsubscribe = function(a) {
                var b = !0;
                for (var c in this[a].sinchStack) this[a].sinchStack[c].pop(), b &= 0 == this[a].sinchStack[c].length;
                b && this[a].unsubscribe({ channel: Object.keys(this[a].sinchStack) }) }, q.prototype.signalStatus = function() {
                return this.signalPubNub.sinchStack[this.rtcProfile.signalChannel].length > 0 }, q.prototype._onmessagePubNub = function(a) { this.sinch.log(new MXPLog("Recieved message", a)), t.fcall(this.collectFrames.bind(this), a).then(this.identifyKey.bind(this)).then(U).then(this.handleMessage.bind(this)).fail(function(b) {
                    if (b instanceof s) {
                        var c = a.split(" ")[1];
                        this.unencryptedFrames[c] = this.unencryptedFrames[c] || [], this.unencryptedFrames[c].push(b.response.message) } else this.handleError(b) }.bind(this)) }, q.prototype.configureMxpSession = function(a, b, c) { this.sessionBuffert[a] = { key: b, body: c }, this.processUnencryptedForKey(a) }, q.prototype.processUnencryptedForKey = function(a) {
                for (var b in this.unencryptedFrames[a]) this._onmessagePubNub(this.unencryptedFrames[a][b]), delete this.unencryptedFrames[a][b] }, q.prototype._ondisconnectPubNub = function(a) { this.sinch.log(new MXPLog("Was disconnected!", a)) }, q.prototype._onerrorPubNub = function(a) {
                var b = new MXPError(w.ErrorDomainNetwork, x.NetworkConnectionRefused, "PubNub error", a);
                this.sinch.log(b) }, q.prototype.collectFrames = function(a) {
                var b = t.defer(),
                    c = a.split(" "),
                    d = c[1] + c[2];
                try { c[3] = parseInt(c[3]), c[4] = parseInt(c[4]) } catch (e) { console.error("Could not parse MXP indices. Malformatted MXP message.") }
                if (1 === c[4]) b.resolve(a);
                else if ((this.messageBuffert[d] || (this.messageBuffert[d] = {}))[c[3]] = c[5], Object.keys(this.messageBuffert[d]).length == c[4]) {
                    var f = c[0] + " " + c[1] + " " + c[2] + " 0 1 ";
                    for (var g in this.messageBuffert[d]) f += this.messageBuffert[d][g];
                    void 0 !== c[6] && (f += " " + c[6]), this.sinch.log(new MXPLog("All frames collected and merged, full array", this.messageBuffert[d])), delete this.messageBuffert[d], b.resolve(f) } else b.reject(new MXPLog("All frames not yet gathered", this.messageBuffert[d]));
                return b.promise }, q.prototype.identifyKey = function(a) { this.sinch.log(new MXPLog("Will identify key", a));
                var b, c = t.defer(),
                    d = a.trim().split(" ");
                return void 0 !== (b = d[6]) ? (this.sinch.log(new MXPLog("Transport key identified", a)), this.getTransport(b).then(function(e) { c.resolve(new r({ mxpSessionId: d[1], message: a, transportId: b, transportObj: e, key: this.transportBuffert[b].key, keyType: "T" })) }.bind(this)).fail(function(a) { c.reject(a) }.bind(this))) : void 0 !== (this.sessionBuffert[d[1]] || {}).key ? (this.sinch.log(new MXPLog("Session key in buffert identified", a)), c.resolve(new r({ mxpSessionId: d[1], message: a, key: this.sessionBuffert[d[1]].key, keyType: "S" }))) : (this.sinch.log(new MXPLog("No key, fall back on instance key", a)), c.resolve(new r({ mxpSessionId: d[1], message: a, key: this.rtcProfile.key, keyType: "I" }))), c.promise }, q.prototype.handleMessage = function(a) { this.sinch.log(new MXPLog("Will handle message", a));
                var b = t.defer(),
                    c = a.decrypted.md + "_" + (a.decrypted.bt || "null");
                return this.sinch.logMxp(new MXPIncoming(c, a)), O[c] ? O[c].call(this, a) : b.reject(new MXPError(w.ErrorDomainOther, x.OtherOther, "Handler not implemented: " + c, {})), b.promise }, q.prototype.handleError = function(a) { this.sinch.log(a), a.stack && console.error(a.stack) }, q.prototype.getTransport = function(a) {
                var b = t.defer();
                if (a.constructor == String) {
                    var c = a;
                    void 0 !== this.transportBuffert[c] ? (this.sinch.log(new MXPLog("Got transport from Buffert", this.transportBuffert[c])), b.resolve(this.transportBuffert[c])) : this.sinch.getTransportById({ transportId: c }).then(function(a) { this.sinch.log(new MXPLog("Got new transport", a)), this.transportBuffert[c] = a, b.resolve(this.transportBuffert[c]) }.bind(this)) } else {
                    if (a instanceof r || a instanceof Array) {
                        var d = a instanceof r ? a.recipientIds : a;
                        d = d.filter(function(a, b, c) {
                            return c.indexOf(a) === b });
                        var e = d.indexOf(this.user.userId);
                        e > -1 && d.splice(e, 1);
                        var f = [];
                        d.forEach(function(a) {
                            if ("string" == typeof a) f.push({ identity: a });
                            else if (a instanceof Object) {
                                for (var b in a) f.push({ identity: a[b], type: b }) } }), d.push(this.user.userId), d = d.sort();
                        var g = btoa(JSON.stringify(d));
                        if (this.transportBuffert[g]) {
                            var h = this.transportBuffert[g];
                            this.sinch.log(new MXPLog("Got cached transport for recipient(s)", h)), a instanceof r ? (a.transportObj = h, a.transportId = a.transportObj.transportId, b.resolve(a)) : b.resolve(h) } else this.sinch.getTransportByParticipants(f).then(function(c) { c.participants.forEach(function(a) { a.capabilityUnion = [], (a.instances || []).forEach(function(b) { a.capabilityUnion = a.capabilityUnion.concat(b.capabilities) }), a.capabilityUnion = a.capabilityUnion.filter(function(b, c) {
                                    return a.capabilityUnion.indexOf(b) == c }) });
                            var e = [];
                            if (c.participants.forEach(function(a) {-1 === a.capabilityUnion.indexOf("im") && -1 === a.capabilityUnion.indexOf("im.1") && e.push(a.destination.identity) }), e.length > 0) throw new SinchError(w.ErrorDomainCapability, x.CapabilityCapabilityMissing, "User missing capability", e);
                            c.participants.unshift({ channel: this.rtcProfile.transportChannel, destination: { identity: this.user.userId } });
                            var f = c.participants.reduce(function(a, b) {
                                    return a.push(b.destination.identity), a }.bind(this), []),
                                h = d.filter(function(a) {
                                    return f.indexOf(a) < 0 });
                            if (d.length != c.participants.length) throw new MXPError(w.ErrorDomainCapability, x.CapabilityUserNotFound, "User does not exist", h);
                            this.sinch.log(new MXPLog("Got new transport for recipient(s)", c)), this.transportBuffert[g] = c, a instanceof r ? (a.transportObj = c, a.transportId = a.transportObj.transportId, b.resolve(a)) : b.resolve(c) }.bind(this)).fail(function(a) { b.reject(a) });
                        return b.promise }
                    b.reject(new MXPError(w.ErrorDomainOther, x.OtherOther, "Unknown transport ID", c)) }
                return b.promise }, q.prototype.sendMXP = function(a) {
                var b = t.defer();
                return a.sub = a.sub || "broadcastPubNub", t.fcall(this.constructMXP.bind(this), a).then(this.identifyEnKey.bind(this)).then(T).then(this.splitFrames.bind(this)).then(this.getTxChannels.bind(this)).then(this.transmitFrames.bind(this)).then(function(a) { b.resolve(a) }).fail(function(a) { console.error(a.stack), console.error(a), b.reject(a) }).progress(function(a) { b.notify(a) }), b.promise }, q.prototype.constructMXP = function(a) {
                return a.decrypted.fu = this.user.userId, a.decrypted.fi = this.sinch._sessionId + ":" + this.sinch._subInstanceId, a.decrypted.fd = this.sinch._sessionId, a.decrypted.fc = "", this.sinch.log(new MXPLog("Added meta data to MXP message", a)), a }, q.prototype.identifyEnKey = function(a) {
                return a.transportObj ? (a.transportId = a.transportObj.transportId, a.key = a.transportObj.key, a.keyType = "T", a.decrypted.fs = this.rtcProfile.transportChannel) : (a.key = this.sessionBuffert[a.mxpSessionId].key, a.keyType = "S", a.decrypted.fs = this.rtcProfile.signalChannel), this.sinch.log(new MXPLog("Identified Encoding Key", a)), a }, q.prototype.splitFrames = function(a) { a.encodedFrames = [];
                var b = 1500;
                b -= a.mxpSessionId.length, b -= (a.transportId || "").length, b -= 9, b -= 6;
                do a.encodedFrames.push(a.encrypted.slice(0, b)), a.encrypted = a.encrypted.substring(b); while (a.encrypted.length > 0);
                var c = Math.floor(2e9 * Math.random());
                for (var d in a.encodedFrames) a.encodedFrames[d] = "10 " + a.mxpSessionId + " " + (a.encodedFrames.length > 1 ? c : "-") + " " + d + " " + a.encodedFrames.length + " " + a.encodedFrames[d], a.transportId && (a.encodedFrames[d] += " " + a.transportId);
                return this.sinch.log(new MXPLog("Split message into frames as needed", a)), a }, q.prototype.getTxChannels = function(a) {
                return a.txChannels = a.txChannels || [], a.transportObj && a.transportObj.participants.forEach(function(b) { a.txChannels.push(b.channel) }), this.sinch.log(new MXPLog("Identified Tx Channels", a)), a }, q.prototype.transmitFrames = function(a) {
                var b = t.defer();
                this.sinch.logMxp(new MXPOutgoing(a.decrypted.md + "_" + (a.decrypted.bt || "null"), a));
                var c, d = [];
                return c = a.transportObj ? a.transportObj.participants.length * a.encodedFrames.length : a.encodedFrames.length, d.length == c && b.resolve(a), a.txChannels.forEach(function(e) { a.encodedFrames.forEach(function(f) { this.sinch.log(new MXPLog("Transmitting [channel, frame]", [e, f])), this[a.sub].publish({ channel: e, message: f, callback: function(e) { d.push(e), b.notify(new Notification(d.length, c, "MXP Message send progress (frame Tx)")), d.length == c && setTimeout(function() { b.resolve(a) }, 1e3) }, error: function(a) { console.error("PubNub: Error sending frame", a), b.reject(new MXPError(w.ErrorDomainOther, x.OtherOther, "PubNub: Error sending frame", a)) } }) }.bind(this)) }.bind(this)), b.promise }, MXPError.prototype = Error.prototype;
            var L = 10;
            q.prototype.joinIncomingCall = function(a, b) {
                var c = t.defer(),
                    d = new r({ mxpSessionId: a.callId }, a);
                return d.decrypted.bd = b || null, d.decrypted.md = 3, d.decrypted.bt = b ? "media" : "sdp", d.decrypted.bv = L, this.sendMXP(d).then(function() { c.resolve() }).fail(function(a) { c.reject(a) }).progress(function(a) { c.notify(a) }.bind(this)), c.promise }, q.prototype.callJoined = function(a) {
                var b = t.defer(),
                    c = new r({ mxpSessionId: a.callId }, a);
                return c.decrypted.bd = JSON.stringify(a.clientMap[a.activeInstance]), c.decrypted.md = 4, c.decrypted.bt = "client", c.decrypted.bv = L, delete c.decrypted.nvps.to, this.sendMXP(c).then(function() { b.resolve() }).fail(function(a) { b.reject(a) }).progress(function(a) { b.notify(a) }.bind(this)), b.promise }, q.prototype.sendSdpAnswer = function(a, b) {
                var c = t.defer(),
                    d = new r({ mxpSessionId: a.callId }, a);
                return d.decrypted.bd = b ? JSON.stringify(b) : null, d.decrypted.md = 2, d.decrypted.bt = b ? "sdp" : null, d.decrypted.bv = L, this.sendMXP(d).then(function() { c.resolve() }).fail(function(a) { c.reject(a) }).progress(function(a) { c.notify(a) }.bind(this)), c.promise }, q.prototype.callHangup = function(a) {
                var b = t.defer(),
                    c = new r({ mxpSessionId: a.callId }, a);
                return c.decrypted.md = 5, c.decrypted.bv = L, this.sendMXP(c).then(function() { b.resolve() }).fail(function(a) { b.reject(a) }).progress(function(a) { b.notify(a) }.bind(this)), b.promise }, q.prototype.callDeny = function(a) {
                var b = t.defer(),
                    c = new r({ mxpSessionId: a.callId }, a);
                return c.decrypted.md = 6, c.decrypted.bv = L, this.sendMXP(c).then(function() { b.resolve() }).fail(function(a) { b.reject(a) }).progress(function(a) { b.notify(a) }.bind(this)), b.promise }, q.prototype.callCancel = function(a) {
                var b = t.defer(),
                    c = new r({ mxpSessionId: a.callId }, a);
                return c.decrypted.md = 7, c.decrypted.bv = L, this.sendMXP(c).then(function() { b.resolve() }).fail(function(a) { b.reject(a) }).progress(function(a) { b.notify(a) }.bind(this)), b.promise }, q.prototype.callTxICECandidate = function(a, b, c) {
                var d = t.defer(),
                    e = new r({ mxpSessionId: a.callId }, a);
                return e.decrypted.bd = JSON.stringify(b), e.decrypted.md = 10, e.decrypted.bt = "sdp", e.decrypted.bv = L, c && (e.decrypted.nvps = e.decrypted.nvps || {}, e.decrypted.nvps.to = c || "undefined"), this.sendMXP(e).then(function() { d.resolve() }).fail(function(a) { d.reject(a) }).progress(function(a) { d.notify(a) }.bind(this)), d.promise }, q.prototype.callTxPeerEventSDP = function(a, b, c) {
                var d = t.defer(),
                    e = new r({ mxpSessionId: a.callId }, a);
                return e.decrypted.bd = JSON.stringify(b), e.decrypted.md = 10, e.decrypted.bt = "sdp", e.decrypted.bv = L, e.decrypted.nvps = e.decrypted.nvps || {}, e.decrypted.nvps.to = c || "undefined", this.sendMXP(e).then(function() { d.resolve() }).fail(function(a) { d.reject(a) }).progress(function(a) { d.notify(a) }.bind(this)), d.promise }, q.prototype.msgToMe = function(a) {
                return !a.decrypted.nvps || !a.decrypted.nvps.to || a.decrypted.nvps.to == this.sinch._sessionId + ":" + this.sinch._subInstanceId }, q.prototype.msgToMe2 = function(a) {
                return !a.decrypted.nvps || !a.decrypted.nvps.to || a.decrypted.nvps.to == this.sinch._sessionId };
            var M = function() {
                    if ("undefined" == typeof this.sinch.callClient) {
                        var a = new MXPError(w.ErrorDomainCapability, x.CapabilityCapabilityMissing, "Can not process call signal messages. Call capability not set.");
                        this.sinch.log(a) } },
                N = { "1_media": function(a) { this.msgToMe2(a) ? (M.call(this), this.sinch.callClient && this.sinch.callClient.handleIncomingCall(a)) : this.sinch.log(new Notification(0, 1, "Received INVITE message not meant for this instance, nvps.to header set to foreign instance id", a)) }, "2_media": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpAck(a) }, "2_sdp": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpAck(a) }, "3_media": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpJoin(a) }, "3_sdp": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpJoin(a) }, "4_client": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpJoined(a) }, "5_null": function(a) { this.msgToMe(a) ? this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpHangup(a) : this.sinch.log(new Notification(0, 1, "Received HUNG_UP message not meant for this instance, nvps.to header set to foreign instance id", a)) }, "6_null": function(a) { this.msgToMe(a) ? this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpDeny(a) : this.sinch.callClient && this.sinch.log(new Notification(0, 1, "Received DENIED message not meant for this instance, nvps.to header set to foreign instance id", a)) }, "6_error/json": function(a) { this.msgToMe(a) ? this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpDeny(a) : this.sinch.callClient && this.sinch.log(new Notification(0, 1, "Received DENIED message not meant for this instance, nvps.to header set to foreign instance id", a)) }, "7_null": function(a) { this.msgToMe(a) ? this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpCancel(a) : this.sinch.log(new Notification(0, 1, "Received CANCEL message not meant for this instance, nvps.to header set to foreign instance id", a)) }, "7_client": function(a) { this.msgToMe(a) ? this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpCancel(a) : this.sinch.log(new Notification(0, 1, "Received CANCEL message not meant for this instance, nvps.to header set to foreign instance id", a)) }, "9_message": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpFail(a) }, "9_error/json": function(a) { this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpFail(a) }, "10_sdp": function(a) {
                        if (this.msgToMe(a)) {
                            var b = JSON.parse(a.decrypted.bd); "type" in b ? this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpPeerEventSdp(a) : this.sinch.callClient && this.sinch.callClient.callBuffert[a.mxpSessionId] && this.sinch.callClient.callBuffert[a.mxpSessionId].mxpInjectIce(a) } else this.sinch.log(new Notification(0, 1, "Received SDP/CAND message not meant for this instance, nvps.to header set to foreign instance id", a)) } },
                O = O || {};
            for (var P in N) O[P] = N[P];
            var Q = 10;
            q.prototype.sendMessage = function(a) {
                var b = a.getMXPMessageObj(),
                    c = t.defer();
                return b.decrypted.md = 1, b.decrypted.bt = "msg", b.decrypted.bv = Q, this.getTransport(b).then(this.sendMXP.bind(this)).then(function(a) { O["1_msg"].call(this, a), this.sinch.log(new MXPLog("Message sent to all participants", a)), c.resolve(this.sinch.messageClient.messageBuffert[a.mxpSessionId]) }.bind(this)).fail(function(a) { c.reject(a) }).progress(function(a) { c.notify(a) }.bind(this)), c.promise }, q.prototype.sendMsgAck = function(a) {
                var b = new r({ mxpSessionId: a.mxpSessionId });
                b.decrypted.md = 2, b.decrypted.bt = a.decrypted.bt, b.decrypted.bv = Q, b.transportObj = a.transportObj;
                var c = [];
                b.transportObj.participants.forEach(function(b) { b.channel == a.decrypted.fs && c.push(b) }.bind(this)), b.transportObj.participants = c, Object.keys(b.transportObj.participants).length > 0 && (this.sinch.log(new MXPLog("Will send Ack", b)), this.sendMXP(b).then(function(b) { this.sinch.log(new MXPLog("Sent ack", [a.decrypted.fu, b.channel])) }.bind(this)).fail(function(a) { console.error(a) })) };
            var R = function() {
                    if ("undefined" == typeof this.sinch.messageClient) {
                        var a = new MXPError(w.ErrorDomainCapability, x.CapabilityCapabilityMissing, "Can not process IM messages. Messaging capability not set.");
                        this.sinch.log(a) } },
                S = { none: function(a) { console.log("Null handler for message object: ", a) }, "1_msg": function(a) { R.call(this);
                        var b = this.sinch.messageClient && this.sinch.messageClient.handleMessage(a);
                        b && a.decrypted.fu != this.user.userId && this.sendMsgAck(a) }, "2_msg": function(a) { this.sinch.messageClient && this.sinch.messageClient.ackMsg(a.decrypted.fu, a.mxpSessionId) } },
                O = O || {};
            for (var P in S) O[P] = S[P];
            r.prototype.getSenderId = function() {
                if ("undefined" == typeof this.decrypted.fi) throw new SinchError(w.ErrorDomainSDK, x.SDKInternalError, "getSenderId failed, no from instance defined", {});
                return this.decrypted.fsi ? this.decrypted.fi + this.decrypted.fsi || "virtual" : (this.decrypted.nvps || {}).fsi ? this.decrypted.fi + this.decrypted.nvps.fsi || "virtual" : this.decrypted.fi || "virtual" }, r.prototype.getFrom = function() {
                return { fc: this.decrypted.fc, fd: this.decrypted.fd, fi: this.decrypted.fi, fsi: this.decrypted.fsi, fs: this.decrypted.fs, fu: this.decrypted.fu } };
            var T = function(a) {
                    var b = a.key,
                        c = a.decrypted;
                    a.mxpSessionId;
                    try {
                        var d = V.enc.Utf8.parse(JSON.stringify(c));
                        b = V.enc.Base64.parse(b);
                        var e = V.lib.WordArray.random(16),
                            f = V.AES.encrypt(d, b, { iv: e }),
                            g = V.enc.Hex.parse(e.toString(V.enc.Hex) + f.ciphertext.toString(V.enc.Hex)) } catch (h) {
                        throw h.message = a.message, new s(w.ErrorDomainOther, x.OtherOther, "MXPEncrypt error: " + h.message, h) }
                    return a.encrypted = g.toString(V.enc.Base64), a },
                U = function(a) {
                    try {
                        var b = a.key,
                            c = a.message,
                            d = c.split(" ")[5],
                            e = V.enc.Base64.parse(d),
                            f = e.toString(V.enc.Hex),
                            g = V.enc.Hex.parse(f.substr(0, 32)),
                            h = V.enc.Hex.parse(f.substr(32)),
                            i = V.lib.CipherParams.create({ ciphertext: h, salt: null }),
                            j = V.AES.decrypt(i, V.enc.Base64.parse(b), { iv: g }),
                            k = j.toString(V.enc.Utf8),
                            l = k.indexOf("{"),
                            m = k.lastIndexOf("}") + 1;
                        k = k.substring(l, m), a.decrypted = JSON.parse(k) } catch (n) {
                        throw n.message = a.message, new s(w.ErrorDomainOther, x.OtherOther, "MXPDecrypt error: " + n.message, n) }
                    return a },
                V = V || function(a, b) {
                    var c = {},
                        d = c.lib = {},
                        e = function() {},
                        f = d.Base = { extend: function(a) { e.prototype = this;
                                var b = new e;
                                return a && b.mixIn(a), b.hasOwnProperty("init") || (b.init = function() { b.$super.init.apply(this, arguments) }), b.init.prototype = b, b.$super = this, b }, create: function() {
                                var a = this.extend();
                                return a.init.apply(a, arguments), a }, init: function() {}, mixIn: function(a) {
                                for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                                a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function() {
                                return this.init.prototype.extend(this) } },
                        g = d.WordArray = f.extend({ init: function(a, c) { a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length }, toString: function(a) {
                                return (a || i).stringify(this) }, concat: function(a) {
                                var b = this.words,
                                    c = a.words,
                                    d = this.sigBytes;
                                if (a = a.sigBytes, this.clamp(), d % 4)
                                    for (var e = 0; a > e; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                                else if (65535 < c.length)
                                    for (e = 0; a > e; e += 4) b[d + e >>> 2] = c[e >>> 2];
                                else b.push.apply(b, c);
                                return this.sigBytes += a, this }, clamp: function() {
                                var b = this.words,
                                    c = this.sigBytes;
                                b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4) }, clone: function() {
                                var a = f.clone.call(this);
                                return a.words = this.words.slice(0), a }, random: function(b) {
                                for (var c = [], d = 0; b > d; d += 4) c.push(4294967296 * a.random() | 0);
                                return new g.init(c, b) } }),
                        h = c.enc = {},
                        i = h.Hex = { stringify: function(a) {
                                var b = a.words;
                                a = a.sigBytes;
                                for (var c = [], d = 0; a > d; d++) {
                                    var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                                    c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16)) }
                                return c.join("") }, parse: function(a) {
                                for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                                return new g.init(c, b / 2) } },
                        j = h.Latin1 = { stringify: function(a) {
                                var b = a.words;
                                a = a.sigBytes;
                                for (var c = [], d = 0; a > d; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                                return c.join("") }, parse: function(a) {
                                for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                                return new g.init(c, b) } },
                        k = h.Utf8 = { stringify: function(a) {
                                try {
                                    return decodeURIComponent(escape(j.stringify(a))) } catch (b) {
                                    throw Error("Malformed UTF-8 data") } }, parse: function(a) {
                                return j.parse(unescape(encodeURIComponent(a))) } },
                        l = d.BufferedBlockAlgorithm = f.extend({ reset: function() { this._data = new g.init, this._nDataBytes = 0 }, _append: function(a) { "string" == typeof a && (a = k.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes }, _process: function(b) {
                                var c = this._data,
                                    d = c.words,
                                    e = c.sigBytes,
                                    f = this.blockSize,
                                    h = e / (4 * f),
                                    h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                                if (b = h * f, e = a.min(4 * b, e), b) {
                                    for (var i = 0; b > i; i += f) this._doProcessBlock(d, i);
                                    i = d.splice(0, b), c.sigBytes -= e }
                                return new g.init(i, e) }, clone: function() {
                                var a = f.clone.call(this);
                                return a._data = this._data.clone(), a }, _minBufferSize: 0 });
                    d.Hasher = l.extend({ cfg: f.extend(), init: function(a) { this.cfg = this.cfg.extend(a), this.reset() }, reset: function() { l.reset.call(this), this._doReset() }, update: function(a) {
                            return this._append(a), this._process(), this }, finalize: function(a) {
                            return a && this._append(a), this._doFinalize() }, blockSize: 16, _createHelper: function(a) {
                            return function(b, c) {
                                return new a.init(c).finalize(b) } }, _createHmacHelper: function(a) {
                            return function(b, c) {
                                return new m.HMAC.init(a, c).finalize(b) } } });
                    var m = c.algo = {};
                    return c }(Math);
            ! function(a) {
                function b(a, b, c, d, e, f, g) {
                    return a = a + (b & c | ~b & d) + e + g, (a << f | a >>> 32 - f) + b }

                function c(a, b, c, d, e, f, g) {
                    return a = a + (b & d | c & ~d) + e + g, (a << f | a >>> 32 - f) + b }

                function d(a, b, c, d, e, f, g) {
                    return a = a + (b ^ c ^ d) + e + g, (a << f | a >>> 32 - f) + b }

                function e(a, b, c, d, e, f, g) {
                    return a = a + (c ^ (b | ~d)) + e + g, (a << f | a >>> 32 - f) + b }
                for (var f = V, g = f.lib, h = g.WordArray, i = g.Hasher, g = f.algo, j = [], k = 0; 64 > k; k++) j[k] = 4294967296 * a.abs(a.sin(k + 1)) | 0;
                g = g.MD5 = i.extend({ _doReset: function() { this._hash = new h.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function(a, f) {
                        for (var g = 0; 16 > g; g++) {
                            var h = f + g,
                                i = a[h];
                            a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8) }
                        var g = this._hash.words,
                            h = a[f + 0],
                            i = a[f + 1],
                            k = a[f + 2],
                            l = a[f + 3],
                            m = a[f + 4],
                            n = a[f + 5],
                            o = a[f + 6],
                            p = a[f + 7],
                            q = a[f + 8],
                            r = a[f + 9],
                            s = a[f + 10],
                            t = a[f + 11],
                            u = a[f + 12],
                            v = a[f + 13],
                            w = a[f + 14],
                            x = a[f + 15],
                            y = g[0],
                            z = g[1],
                            A = g[2],
                            B = g[3],
                            y = b(y, z, A, B, h, 7, j[0]),
                            B = b(B, y, z, A, i, 12, j[1]),
                            A = b(A, B, y, z, k, 17, j[2]),
                            z = b(z, A, B, y, l, 22, j[3]),
                            y = b(y, z, A, B, m, 7, j[4]),
                            B = b(B, y, z, A, n, 12, j[5]),
                            A = b(A, B, y, z, o, 17, j[6]),
                            z = b(z, A, B, y, p, 22, j[7]),
                            y = b(y, z, A, B, q, 7, j[8]),
                            B = b(B, y, z, A, r, 12, j[9]),
                            A = b(A, B, y, z, s, 17, j[10]),
                            z = b(z, A, B, y, t, 22, j[11]),
                            y = b(y, z, A, B, u, 7, j[12]),
                            B = b(B, y, z, A, v, 12, j[13]),
                            A = b(A, B, y, z, w, 17, j[14]),
                            z = b(z, A, B, y, x, 22, j[15]),
                            y = c(y, z, A, B, i, 5, j[16]),
                            B = c(B, y, z, A, o, 9, j[17]),
                            A = c(A, B, y, z, t, 14, j[18]),
                            z = c(z, A, B, y, h, 20, j[19]),
                            y = c(y, z, A, B, n, 5, j[20]),
                            B = c(B, y, z, A, s, 9, j[21]),
                            A = c(A, B, y, z, x, 14, j[22]),
                            z = c(z, A, B, y, m, 20, j[23]),
                            y = c(y, z, A, B, r, 5, j[24]),
                            B = c(B, y, z, A, w, 9, j[25]),
                            A = c(A, B, y, z, l, 14, j[26]),
                            z = c(z, A, B, y, q, 20, j[27]),
                            y = c(y, z, A, B, v, 5, j[28]),
                            B = c(B, y, z, A, k, 9, j[29]),
                            A = c(A, B, y, z, p, 14, j[30]),
                            z = c(z, A, B, y, u, 20, j[31]),
                            y = d(y, z, A, B, n, 4, j[32]),
                            B = d(B, y, z, A, q, 11, j[33]),
                            A = d(A, B, y, z, t, 16, j[34]),
                            z = d(z, A, B, y, w, 23, j[35]),
                            y = d(y, z, A, B, i, 4, j[36]),
                            B = d(B, y, z, A, m, 11, j[37]),
                            A = d(A, B, y, z, p, 16, j[38]),
                            z = d(z, A, B, y, s, 23, j[39]),
                            y = d(y, z, A, B, v, 4, j[40]),
                            B = d(B, y, z, A, h, 11, j[41]),
                            A = d(A, B, y, z, l, 16, j[42]),
                            z = d(z, A, B, y, o, 23, j[43]),
                            y = d(y, z, A, B, r, 4, j[44]),
                            B = d(B, y, z, A, u, 11, j[45]),
                            A = d(A, B, y, z, x, 16, j[46]),
                            z = d(z, A, B, y, k, 23, j[47]),
                            y = e(y, z, A, B, h, 6, j[48]),
                            B = e(B, y, z, A, p, 10, j[49]),
                            A = e(A, B, y, z, w, 15, j[50]),
                            z = e(z, A, B, y, n, 21, j[51]),
                            y = e(y, z, A, B, u, 6, j[52]),
                            B = e(B, y, z, A, l, 10, j[53]),
                            A = e(A, B, y, z, s, 15, j[54]),
                            z = e(z, A, B, y, i, 21, j[55]),
                            y = e(y, z, A, B, q, 6, j[56]),
                            B = e(B, y, z, A, x, 10, j[57]),
                            A = e(A, B, y, z, o, 15, j[58]),
                            z = e(z, A, B, y, v, 21, j[59]),
                            y = e(y, z, A, B, m, 6, j[60]),
                            B = e(B, y, z, A, t, 10, j[61]),
                            A = e(A, B, y, z, k, 15, j[62]),
                            z = e(z, A, B, y, r, 21, j[63]);
                        g[0] = g[0] + y | 0, g[1] = g[1] + z | 0, g[2] = g[2] + A | 0, g[3] = g[3] + B | 0 }, _doFinalize: function() {
                        var b = this._data,
                            c = b.words,
                            d = 8 * this._nDataBytes,
                            e = 8 * b.sigBytes;
                        c[e >>> 5] |= 128 << 24 - e % 32;
                        var f = a.floor(d / 4294967296);
                        for (c[(e + 64 >>> 9 << 4) + 15] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8), c[(e + 64 >>> 9 << 4) + 14] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8), b.sigBytes = 4 * (c.length + 1), this._process(), b = this._hash, c = b.words, d = 0; 4 > d; d++) e = c[d], c[d] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8);
                        return b }, clone: function() {
                        var a = i.clone.call(this);
                        return a._hash = this._hash.clone(), a } }), f.MD5 = i._createHelper(g), f.HmacMD5 = i._createHmacHelper(g) }(Math);
            var V = V || function(a, b) {
                var c = {},
                    d = c.lib = {},
                    e = function() {},
                    f = d.Base = { extend: function(a) { e.prototype = this;
                            var b = new e;
                            return a && b.mixIn(a), b.hasOwnProperty("init") || (b.init = function() { b.$super.init.apply(this, arguments) }), b.init.prototype = b, b.$super = this, b }, create: function() {
                            var a = this.extend();
                            return a.init.apply(a, arguments), a }, init: function() {}, mixIn: function(a) {
                            for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                            a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function() {
                            return this.init.prototype.extend(this) } },
                    g = d.WordArray = f.extend({ init: function(a, c) { a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length }, toString: function(a) {
                            return (a || i).stringify(this) }, concat: function(a) {
                            var b = this.words,
                                c = a.words,
                                d = this.sigBytes;
                            if (a = a.sigBytes, this.clamp(), d % 4)
                                for (var e = 0; a > e; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                            else if (65535 < c.length)
                                for (e = 0; a > e; e += 4) b[d + e >>> 2] = c[e >>> 2];
                            else b.push.apply(b, c);
                            return this.sigBytes += a, this }, clamp: function() {
                            var b = this.words,
                                c = this.sigBytes;
                            b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4) }, clone: function() {
                            var a = f.clone.call(this);
                            return a.words = this.words.slice(0), a }, random: function(b) {
                            for (var c = [], d = 0; b > d; d += 4) c.push(4294967296 * a.random() | 0);
                            return new g.init(c, b) } }),
                    h = c.enc = {},
                    i = h.Hex = { stringify: function(a) {
                            var b = a.words;
                            a = a.sigBytes;
                            for (var c = [], d = 0; a > d; d++) {
                                var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                                c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16)) }
                            return c.join("") }, parse: function(a) {
                            for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                            return new g.init(c, b / 2) } },
                    j = h.Latin1 = { stringify: function(a) {
                            var b = a.words;
                            a = a.sigBytes;
                            for (var c = [], d = 0; a > d; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                            return c.join("") }, parse: function(a) {
                            for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                            return new g.init(c, b) } },
                    k = h.Utf8 = { stringify: function(a) {
                            try {
                                return decodeURIComponent(escape(j.stringify(a))) } catch (b) {
                                throw Error("Malformed UTF-8 data") } }, parse: function(a) {
                            return j.parse(unescape(encodeURIComponent(a))) } },
                    l = d.BufferedBlockAlgorithm = f.extend({ reset: function() { this._data = new g.init, this._nDataBytes = 0 }, _append: function(a) { "string" == typeof a && (a = k.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes }, _process: function(b) {
                            var c = this._data,
                                d = c.words,
                                e = c.sigBytes,
                                f = this.blockSize,
                                h = e / (4 * f),
                                h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                            if (b = h * f, e = a.min(4 * b, e), b) {
                                for (var i = 0; b > i; i += f) this._doProcessBlock(d, i);
                                i = d.splice(0, b), c.sigBytes -= e }
                            return new g.init(i, e) }, clone: function() {
                            var a = f.clone.call(this);
                            return a._data = this._data.clone(), a }, _minBufferSize: 0 });
                d.Hasher = l.extend({ cfg: f.extend(), init: function(a) { this.cfg = this.cfg.extend(a), this.reset() }, reset: function() { l.reset.call(this), this._doReset() }, update: function(a) {
                        return this._append(a), this._process(), this }, finalize: function(a) {
                        return a && this._append(a), this._doFinalize() }, blockSize: 16, _createHelper: function(a) {
                        return function(b, c) {
                            return new a.init(c).finalize(b) } }, _createHmacHelper: function(a) {
                        return function(b, c) {
                            return new m.HMAC.init(a, c).finalize(b) } } });
                var m = c.algo = {};
                return c }(Math);
            ! function(a) {
                for (var b = V, c = b.lib, d = c.WordArray, e = c.Hasher, c = b.algo, f = [], g = [], h = function(a) {
                        return 4294967296 * (a - (0 | a)) | 0 }, i = 2, j = 0; 64 > j;) {
                    var k;
                    a: { k = i;
                        for (var l = a.sqrt(k), m = 2; l >= m; m++)
                            if (!(k % m)) { k = !1;
                                break a }
                        k = !0 }
                    k && (8 > j && (f[j] = h(a.pow(i, .5))), g[j] = h(a.pow(i, 1 / 3)), j++), i++ }
                var n = [],
                    c = c.SHA256 = e.extend({ _doReset: function() { this._hash = new d.init(f.slice(0)) }, _doProcessBlock: function(a, b) {
                            for (var c = this._hash.words, d = c[0], e = c[1], f = c[2], h = c[3], i = c[4], j = c[5], k = c[6], l = c[7], m = 0; 64 > m; m++) {
                                if (16 > m) n[m] = 0 | a[b + m];
                                else {
                                    var o = n[m - 15],
                                        p = n[m - 2];
                                    n[m] = ((o << 25 | o >>> 7) ^ (o << 14 | o >>> 18) ^ o >>> 3) + n[m - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + n[m - 16] }
                                o = l + ((i << 26 | i >>> 6) ^ (i << 21 | i >>> 11) ^ (i << 7 | i >>> 25)) + (i & j ^ ~i & k) + g[m] + n[m], p = ((d << 30 | d >>> 2) ^ (d << 19 | d >>> 13) ^ (d << 10 | d >>> 22)) + (d & e ^ d & f ^ e & f), l = k, k = j, j = i, i = h + o | 0, h = f, f = e, e = d, d = o + p | 0 }
                            c[0] = c[0] + d | 0, c[1] = c[1] + e | 0, c[2] = c[2] + f | 0, c[3] = c[3] + h | 0, c[4] = c[4] + i | 0, c[5] = c[5] + j | 0, c[6] = c[6] + k | 0, c[7] = c[7] + l | 0 }, _doFinalize: function() {
                            var b = this._data,
                                c = b.words,
                                d = 8 * this._nDataBytes,
                                e = 8 * b.sigBytes;
                            return c[e >>> 5] |= 128 << 24 - e % 32, c[(e + 64 >>> 9 << 4) + 14] = a.floor(d / 4294967296), c[(e + 64 >>> 9 << 4) + 15] = d, b.sigBytes = 4 * c.length, this._process(), this._hash }, clone: function() {
                            var a = e.clone.call(this);
                            return a._hash = this._hash.clone(), a } });
                b.SHA256 = e._createHelper(c), b.HmacSHA256 = e._createHmacHelper(c) }(Math),
            function() {
                var a = V,
                    b = a.enc.Utf8;
                a.algo.HMAC = a.lib.Base.extend({ init: function(a, c) { a = this._hasher = new a.init, "string" == typeof c && (c = b.parse(c));
                        var d = a.blockSize,
                            e = 4 * d;
                        c.sigBytes > e && (c = a.finalize(c)), c.clamp();
                        for (var f = this._oKey = c.clone(), g = this._iKey = c.clone(), h = f.words, i = g.words, j = 0; d > j; j++) h[j] ^= 1549556828, i[j] ^= 909522486;
                        f.sigBytes = g.sigBytes = e, this.reset() }, reset: function() {
                        var a = this._hasher;
                        a.reset(), a.update(this._iKey) }, update: function(a) {
                        return this._hasher.update(a), this }, finalize: function(a) {
                        var b = this._hasher;
                        return a = b.finalize(a), b.reset(), b.finalize(this._oKey.clone().concat(a)) } }) }(),
            function() {
                var a = V,
                    b = a.lib.WordArray;
                a.enc.Base64 = { stringify: function(a) {
                        var b = a.words,
                            c = a.sigBytes,
                            d = this._map;
                        a.clamp(), a = [];
                        for (var e = 0; c > e; e += 3)
                            for (var f = (b[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 16 | (b[e + 1 >>> 2] >>> 24 - 8 * ((e + 1) % 4) & 255) << 8 | b[e + 2 >>> 2] >>> 24 - 8 * ((e + 2) % 4) & 255, g = 0; 4 > g && c > e + .75 * g; g++) a.push(d.charAt(f >>> 6 * (3 - g) & 63));
                        if (b = d.charAt(64))
                            for (; a.length % 4;) a.push(b);
                        return a.join("") }, parse: function(a) {
                        var c = a.length,
                            d = this._map,
                            e = d.charAt(64);
                        e && (e = a.indexOf(e), -1 != e && (c = e));
                        for (var e = [], f = 0, g = 0; c > g; g++)
                            if (g % 4) {
                                var h = d.indexOf(a.charAt(g - 1)) << 2 * (g % 4),
                                    i = d.indexOf(a.charAt(g)) >>> 6 - 2 * (g % 4);
                                e[f >>> 2] |= (h | i) << 24 - 8 * (f % 4), f++ }
                        return b.create(e, f) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } }();
            var V = V || function(a, b) {
                var c = {},
                    d = c.lib = {},
                    e = function() {},
                    f = d.Base = { extend: function(a) { e.prototype = this;
                            var b = new e;
                            return a && b.mixIn(a), b.hasOwnProperty("init") || (b.init = function() { b.$super.init.apply(this, arguments) }), b.init.prototype = b, b.$super = this, b }, create: function() {
                            var a = this.extend();
                            return a.init.apply(a, arguments), a }, init: function() {}, mixIn: function(a) {
                            for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                            a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function() {
                            return this.init.prototype.extend(this) } },
                    g = d.WordArray = f.extend({
                        init: function(a, c) { a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length },
                        toString: function(a) {
                            return (a || i).stringify(this) },
                        concat: function(a) {
                            var b = this.words,
                                c = a.words,
                                d = this.sigBytes;
                            if (a = a.sigBytes, this.clamp(), d % 4)
                                for (var e = 0; a > e; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                            else if (65535 < c.length)
                                for (e = 0; a > e; e += 4) b[d + e >>> 2] = c[e >>> 2];
                            else b.push.apply(b, c);
                            return this.sigBytes += a, this },
                        clamp: function() {
                            var b = this.words,
                                c = this.sigBytes;
                            b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4) },
                        clone: function() {
                            var a = f.clone.call(this);
                            return a.words = this.words.slice(0), a },
                        random: function(b) {
                            for (var c = [], d = 0; b > d; d += 4) c.push(4294967296 * a.random() | 0);
                            return new g.init(c, b);
                        }
                    }),
                    h = c.enc = {},
                    i = h.Hex = { stringify: function(a) {
                            var b = a.words;
                            a = a.sigBytes;
                            for (var c = [], d = 0; a > d; d++) {
                                var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                                c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16)) }
                            return c.join("") }, parse: function(a) {
                            for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                            return new g.init(c, b / 2) } },
                    j = h.Latin1 = { stringify: function(a) {
                            var b = a.words;
                            a = a.sigBytes;
                            for (var c = [], d = 0; a > d; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                            return c.join("") }, parse: function(a) {
                            for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                            return new g.init(c, b) } },
                    k = h.Utf8 = { stringify: function(a) {
                            try {
                                return decodeURIComponent(escape(j.stringify(a))) } catch (b) {
                                throw Error("Malformed UTF-8 data") } }, parse: function(a) {
                            return j.parse(unescape(encodeURIComponent(a))) } },
                    l = d.BufferedBlockAlgorithm = f.extend({ reset: function() { this._data = new g.init, this._nDataBytes = 0 }, _append: function(a) { "string" == typeof a && (a = k.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes }, _process: function(b) {
                            var c = this._data,
                                d = c.words,
                                e = c.sigBytes,
                                f = this.blockSize,
                                h = e / (4 * f),
                                h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                            if (b = h * f, e = a.min(4 * b, e), b) {
                                for (var i = 0; b > i; i += f) this._doProcessBlock(d, i);
                                i = d.splice(0, b), c.sigBytes -= e }
                            return new g.init(i, e) }, clone: function() {
                            var a = f.clone.call(this);
                            return a._data = this._data.clone(), a }, _minBufferSize: 0 });
                d.Hasher = l.extend({ cfg: f.extend(), init: function(a) { this.cfg = this.cfg.extend(a), this.reset() }, reset: function() { l.reset.call(this), this._doReset() }, update: function(a) {
                        return this._append(a), this._process(), this }, finalize: function(a) {
                        return a && this._append(a), this._doFinalize() }, blockSize: 16, _createHelper: function(a) {
                        return function(b, c) {
                            return new a.init(c).finalize(b) } }, _createHmacHelper: function(a) {
                        return function(b, c) {
                            return new m.HMAC.init(a, c).finalize(b) } } });
                var m = c.algo = {};
                return c
            }(Math);
            ! function() {
                var a = V,
                    b = a.lib.WordArray;
                a.enc.Base64 = { stringify: function(a) {
                        var b = a.words,
                            c = a.sigBytes,
                            d = this._map;
                        a.clamp(), a = [];
                        for (var e = 0; c > e; e += 3)
                            for (var f = (b[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 16 | (b[e + 1 >>> 2] >>> 24 - 8 * ((e + 1) % 4) & 255) << 8 | b[e + 2 >>> 2] >>> 24 - 8 * ((e + 2) % 4) & 255, g = 0; 4 > g && c > e + .75 * g; g++) a.push(d.charAt(f >>> 6 * (3 - g) & 63));
                        if (b = d.charAt(64))
                            for (; a.length % 4;) a.push(b);
                        return a.join("") }, parse: function(a) {
                        var c = a.length,
                            d = this._map,
                            e = d.charAt(64);
                        e && (e = a.indexOf(e), -1 != e && (c = e));
                        for (var e = [], f = 0, g = 0; c > g; g++)
                            if (g % 4) {
                                var h = d.indexOf(a.charAt(g - 1)) << 2 * (g % 4),
                                    i = d.indexOf(a.charAt(g)) >>> 6 - 2 * (g % 4);
                                e[f >>> 2] |= (h | i) << 24 - 8 * (f % 4), f++ }
                        return b.create(e, f) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } }(),
            function(a) {
                function b(a, b, c, d, e, f, g) {
                    return a = a + (b & c | ~b & d) + e + g, (a << f | a >>> 32 - f) + b }

                function c(a, b, c, d, e, f, g) {
                    return a = a + (b & d | c & ~d) + e + g, (a << f | a >>> 32 - f) + b }

                function d(a, b, c, d, e, f, g) {
                    return a = a + (b ^ c ^ d) + e + g, (a << f | a >>> 32 - f) + b }

                function e(a, b, c, d, e, f, g) {
                    return a = a + (c ^ (b | ~d)) + e + g, (a << f | a >>> 32 - f) + b }
                for (var f = V, g = f.lib, h = g.WordArray, i = g.Hasher, g = f.algo, j = [], k = 0; 64 > k; k++) j[k] = 4294967296 * a.abs(a.sin(k + 1)) | 0;
                g = g.MD5 = i.extend({ _doReset: function() { this._hash = new h.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function(a, f) {
                        for (var g = 0; 16 > g; g++) {
                            var h = f + g,
                                i = a[h];
                            a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8) }
                        var g = this._hash.words,
                            h = a[f + 0],
                            i = a[f + 1],
                            k = a[f + 2],
                            l = a[f + 3],
                            m = a[f + 4],
                            n = a[f + 5],
                            o = a[f + 6],
                            p = a[f + 7],
                            q = a[f + 8],
                            r = a[f + 9],
                            s = a[f + 10],
                            t = a[f + 11],
                            u = a[f + 12],
                            v = a[f + 13],
                            w = a[f + 14],
                            x = a[f + 15],
                            y = g[0],
                            z = g[1],
                            A = g[2],
                            B = g[3],
                            y = b(y, z, A, B, h, 7, j[0]),
                            B = b(B, y, z, A, i, 12, j[1]),
                            A = b(A, B, y, z, k, 17, j[2]),
                            z = b(z, A, B, y, l, 22, j[3]),
                            y = b(y, z, A, B, m, 7, j[4]),
                            B = b(B, y, z, A, n, 12, j[5]),
                            A = b(A, B, y, z, o, 17, j[6]),
                            z = b(z, A, B, y, p, 22, j[7]),
                            y = b(y, z, A, B, q, 7, j[8]),
                            B = b(B, y, z, A, r, 12, j[9]),
                            A = b(A, B, y, z, s, 17, j[10]),
                            z = b(z, A, B, y, t, 22, j[11]),
                            y = b(y, z, A, B, u, 7, j[12]),
                            B = b(B, y, z, A, v, 12, j[13]),
                            A = b(A, B, y, z, w, 17, j[14]),
                            z = b(z, A, B, y, x, 22, j[15]),
                            y = c(y, z, A, B, i, 5, j[16]),
                            B = c(B, y, z, A, o, 9, j[17]),
                            A = c(A, B, y, z, t, 14, j[18]),
                            z = c(z, A, B, y, h, 20, j[19]),
                            y = c(y, z, A, B, n, 5, j[20]),
                            B = c(B, y, z, A, s, 9, j[21]),
                            A = c(A, B, y, z, x, 14, j[22]),
                            z = c(z, A, B, y, m, 20, j[23]),
                            y = c(y, z, A, B, r, 5, j[24]),
                            B = c(B, y, z, A, w, 9, j[25]),
                            A = c(A, B, y, z, l, 14, j[26]),
                            z = c(z, A, B, y, q, 20, j[27]),
                            y = c(y, z, A, B, v, 5, j[28]),
                            B = c(B, y, z, A, k, 9, j[29]),
                            A = c(A, B, y, z, p, 14, j[30]),
                            z = c(z, A, B, y, u, 20, j[31]),
                            y = d(y, z, A, B, n, 4, j[32]),
                            B = d(B, y, z, A, q, 11, j[33]),
                            A = d(A, B, y, z, t, 16, j[34]),
                            z = d(z, A, B, y, w, 23, j[35]),
                            y = d(y, z, A, B, i, 4, j[36]),
                            B = d(B, y, z, A, m, 11, j[37]),
                            A = d(A, B, y, z, p, 16, j[38]),
                            z = d(z, A, B, y, s, 23, j[39]),
                            y = d(y, z, A, B, v, 4, j[40]),
                            B = d(B, y, z, A, h, 11, j[41]),
                            A = d(A, B, y, z, l, 16, j[42]),
                            z = d(z, A, B, y, o, 23, j[43]),
                            y = d(y, z, A, B, r, 4, j[44]),
                            B = d(B, y, z, A, u, 11, j[45]),
                            A = d(A, B, y, z, x, 16, j[46]),
                            z = d(z, A, B, y, k, 23, j[47]),
                            y = e(y, z, A, B, h, 6, j[48]),
                            B = e(B, y, z, A, p, 10, j[49]),
                            A = e(A, B, y, z, w, 15, j[50]),
                            z = e(z, A, B, y, n, 21, j[51]),
                            y = e(y, z, A, B, u, 6, j[52]),
                            B = e(B, y, z, A, l, 10, j[53]),
                            A = e(A, B, y, z, s, 15, j[54]),
                            z = e(z, A, B, y, i, 21, j[55]),
                            y = e(y, z, A, B, q, 6, j[56]),
                            B = e(B, y, z, A, x, 10, j[57]),
                            A = e(A, B, y, z, o, 15, j[58]),
                            z = e(z, A, B, y, v, 21, j[59]),
                            y = e(y, z, A, B, m, 6, j[60]),
                            B = e(B, y, z, A, t, 10, j[61]),
                            A = e(A, B, y, z, k, 15, j[62]),
                            z = e(z, A, B, y, r, 21, j[63]);
                        g[0] = g[0] + y | 0, g[1] = g[1] + z | 0, g[2] = g[2] + A | 0, g[3] = g[3] + B | 0 }, _doFinalize: function() {
                        var b = this._data,
                            c = b.words,
                            d = 8 * this._nDataBytes,
                            e = 8 * b.sigBytes;
                        c[e >>> 5] |= 128 << 24 - e % 32;
                        var f = a.floor(d / 4294967296);
                        for (c[(e + 64 >>> 9 << 4) + 15] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8), c[(e + 64 >>> 9 << 4) + 14] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8), b.sigBytes = 4 * (c.length + 1), this._process(), b = this._hash, c = b.words, d = 0; 4 > d; d++) e = c[d], c[d] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8);
                        return b }, clone: function() {
                        var a = i.clone.call(this);
                        return a._hash = this._hash.clone(), a } }), f.MD5 = i._createHelper(g), f.HmacMD5 = i._createHmacHelper(g) }(Math),
            function() {
                var a = V,
                    b = a.lib,
                    c = b.Base,
                    d = b.WordArray,
                    b = a.algo,
                    e = b.EvpKDF = c.extend({ cfg: c.extend({ keySize: 4, hasher: b.MD5, iterations: 1 }), init: function(a) { this.cfg = this.cfg.extend(a) }, compute: function(a, b) {
                            for (var c = this.cfg, e = c.hasher.create(), f = d.create(), g = f.words, h = c.keySize, c = c.iterations; g.length < h;) { i && e.update(i);
                                var i = e.update(a).finalize(b);
                                e.reset();
                                for (var j = 1; c > j; j++) i = e.finalize(i), e.reset();
                                f.concat(i) }
                            return f.sigBytes = 4 * h, f } });
                a.EvpKDF = function(a, b, c) {
                    return e.create(c).compute(a, b) } }(), V.lib.Cipher || function(a) {
                    var b = V,
                        c = b.lib,
                        d = c.Base,
                        e = c.WordArray,
                        f = c.BufferedBlockAlgorithm,
                        g = b.enc.Base64,
                        h = b.algo.EvpKDF,
                        i = c.Cipher = f.extend({ cfg: d.extend(), createEncryptor: function(a, b) {
                                return this.create(this._ENC_XFORM_MODE, a, b) }, createDecryptor: function(a, b) {
                                return this.create(this._DEC_XFORM_MODE, a, b) }, init: function(a, b, c) { this.cfg = this.cfg.extend(c), this._xformMode = a, this._key = b, this.reset() }, reset: function() { f.reset.call(this), this._doReset() }, process: function(a) {
                                return this._append(a), this._process() }, finalize: function(a) {
                                return a && this._append(a), this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function(a) {
                                return { encrypt: function(b, c, d) {
                                        return ("string" == typeof c ? o : n).encrypt(a, b, c, d) }, decrypt: function(b, c, d) {
                                        return ("string" == typeof c ? o : n).decrypt(a, b, c, d) } } } });
                    c.StreamCipher = i.extend({ _doFinalize: function() {
                            return this._process(!0) }, blockSize: 1 });
                    var j = b.mode = {},
                        k = function(b, c, d) {
                            var e = this._iv;
                            e ? this._iv = a : e = this._prevBlock;
                            for (var f = 0; d > f; f++) b[c + f] ^= e[f] },
                        l = (c.BlockCipherMode = d.extend({ createEncryptor: function(a, b) {
                                return this.Encryptor.create(a, b) }, createDecryptor: function(a, b) {
                                return this.Decryptor.create(a, b) }, init: function(a, b) { this._cipher = a, this._iv = b } })).extend();
                    l.Encryptor = l.extend({ processBlock: function(a, b) {
                            var c = this._cipher,
                                d = c.blockSize;
                            k.call(this, a, b, d), c.encryptBlock(a, b), this._prevBlock = a.slice(b, b + d) } }), l.Decryptor = l.extend({ processBlock: function(a, b) {
                            var c = this._cipher,
                                d = c.blockSize,
                                e = a.slice(b, b + d);
                            c.decryptBlock(a, b), k.call(this, a, b, d), this._prevBlock = e } }), j = j.CBC = l, l = (b.pad = {}).Pkcs7 = { pad: function(a, b) {
                            for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, f = [], g = 0; c > g; g += 4) f.push(d);
                            c = e.create(f, c), a.concat(c) }, unpad: function(a) { a.sigBytes -= 255 & a.words[a.sigBytes - 1 >>> 2] } }, c.BlockCipher = i.extend({ cfg: i.cfg.extend({ mode: j, padding: l }), reset: function() { i.reset.call(this);
                            var a = this.cfg,
                                b = a.iv,
                                a = a.mode;
                            if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
                            else c = a.createDecryptor, this._minBufferSize = 1;
                            this._mode = c.call(a, this, b && b.words) }, _doProcessBlock: function(a, b) { this._mode.processBlock(a, b) }, _doFinalize: function() {
                            var a = this.cfg.padding;
                            if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize);
                                var b = this._process(!0) } else b = this._process(!0), a.unpad(b);
                            return b }, blockSize: 4 });
                    var m = c.CipherParams = d.extend({ init: function(a) { this.mixIn(a) }, toString: function(a) {
                                return (a || this.formatter).stringify(this) } }),
                        j = (b.format = {}).OpenSSL = { stringify: function(a) {
                                var b = a.ciphertext;
                                return a = a.salt, (a ? e.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(g) }, parse: function(a) { a = g.parse(a);
                                var b = a.words;
                                if (1398893684 == b[0] && 1701076831 == b[1]) {
                                    var c = e.create(b.slice(2, 4));
                                    b.splice(0, 4), a.sigBytes -= 16 }
                                return m.create({ ciphertext: a, salt: c }) } },
                        n = c.SerializableCipher = d.extend({ cfg: d.extend({ format: j }), encrypt: function(a, b, c, d) { d = this.cfg.extend(d);
                                var e = a.createEncryptor(c, d);
                                return b = e.finalize(b), e = e.cfg, m.create({ ciphertext: b, key: c, iv: e.iv, algorithm: a, mode: e.mode, padding: e.padding, blockSize: a.blockSize, formatter: d.format }) }, decrypt: function(a, b, c, d) {
                                return d = this.cfg.extend(d), b = this._parse(b, d.format), a.createDecryptor(c, d).finalize(b.ciphertext) }, _parse: function(a, b) {
                                return "string" == typeof a ? b.parse(a, this) : a } }),
                        b = (b.kdf = {}).OpenSSL = { execute: function(a, b, c, d) {
                                return d || (d = e.random(8)), a = h.create({ keySize: b + c }).compute(a, d), c = e.create(a.words.slice(b), 4 * c), a.sigBytes = 4 * b, m.create({ key: a, iv: c, salt: d }) } },
                        o = c.PasswordBasedCipher = n.extend({ cfg: n.cfg.extend({ kdf: b }), encrypt: function(a, b, c, d) {
                                return d = this.cfg.extend(d), c = d.kdf.execute(c, a.keySize, a.ivSize), d.iv = c.iv, a = n.encrypt.call(this, a, b, c.key, d), a.mixIn(c), a }, decrypt: function(a, b, c, d) {
                                return d = this.cfg.extend(d), b = this._parse(b, d.format), c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt), d.iv = c.iv, n.decrypt.call(this, a, b, c.key, d) } }) }(),
                function() {
                    for (var a = V, b = a.lib.BlockCipher, c = a.algo, d = [], e = [], f = [], g = [], h = [], i = [], j = [], k = [], l = [], m = [], n = [], o = 0; 256 > o; o++) n[o] = 128 > o ? o << 1 : o << 1 ^ 283;
                    for (var p = 0, q = 0, o = 0; 256 > o; o++) {
                        var r = q ^ q << 1 ^ q << 2 ^ q << 3 ^ q << 4,
                            r = r >>> 8 ^ 255 & r ^ 99;
                        d[p] = r, e[r] = p;
                        var s = n[p],
                            t = n[s],
                            u = n[t],
                            v = 257 * n[r] ^ 16843008 * r;
                        f[p] = v << 24 | v >>> 8, g[p] = v << 16 | v >>> 16, h[p] = v << 8 | v >>> 24, i[p] = v, v = 16843009 * u ^ 65537 * t ^ 257 * s ^ 16843008 * p, j[r] = v << 24 | v >>> 8, k[r] = v << 16 | v >>> 16, l[r] = v << 8 | v >>> 24, m[r] = v, p ? (p = s ^ n[n[n[u ^ s]]], q ^= n[n[q]]) : p = q = 1 }
                    var w = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
                        c = c.AES = b.extend({ _doReset: function() {
                                for (var a = this._key, b = a.words, c = a.sigBytes / 4, a = 4 * ((this._nRounds = c + 6) + 1), e = this._keySchedule = [], f = 0; a > f; f++)
                                    if (c > f) e[f] = b[f];
                                    else {
                                        var g = e[f - 1];
                                        f % c ? c > 6 && 4 == f % c && (g = d[g >>> 24] << 24 | d[g >>> 16 & 255] << 16 | d[g >>> 8 & 255] << 8 | d[255 & g]) : (g = g << 8 | g >>> 24, g = d[g >>> 24] << 24 | d[g >>> 16 & 255] << 16 | d[g >>> 8 & 255] << 8 | d[255 & g], g ^= w[f / c | 0] << 24), e[f] = e[f - c] ^ g }
                                for (b = this._invKeySchedule = [], c = 0; a > c; c++) f = a - c, g = c % 4 ? e[f] : e[f - 4], b[c] = 4 > c || 4 >= f ? g : j[d[g >>> 24]] ^ k[d[g >>> 16 & 255]] ^ l[d[g >>> 8 & 255]] ^ m[d[255 & g]] }, encryptBlock: function(a, b) { this._doCryptBlock(a, b, this._keySchedule, f, g, h, i, d) }, decryptBlock: function(a, b) {
                                var c = a[b + 1];
                                a[b + 1] = a[b + 3], a[b + 3] = c, this._doCryptBlock(a, b, this._invKeySchedule, j, k, l, m, e), c = a[b + 1], a[b + 1] = a[b + 3], a[b + 3] = c }, _doCryptBlock: function(a, b, c, d, e, f, g, h) {
                                for (var i = this._nRounds, j = a[b] ^ c[0], k = a[b + 1] ^ c[1], l = a[b + 2] ^ c[2], m = a[b + 3] ^ c[3], n = 4, o = 1; i > o; o++) var p = d[j >>> 24] ^ e[k >>> 16 & 255] ^ f[l >>> 8 & 255] ^ g[255 & m] ^ c[n++],
                                    q = d[k >>> 24] ^ e[l >>> 16 & 255] ^ f[m >>> 8 & 255] ^ g[255 & j] ^ c[n++],
                                    r = d[l >>> 24] ^ e[m >>> 16 & 255] ^ f[j >>> 8 & 255] ^ g[255 & k] ^ c[n++],
                                    m = d[m >>> 24] ^ e[j >>> 16 & 255] ^ f[k >>> 8 & 255] ^ g[255 & l] ^ c[n++],
                                    j = p,
                                    k = q,
                                    l = r;
                                p = (h[j >>> 24] << 24 | h[k >>> 16 & 255] << 16 | h[l >>> 8 & 255] << 8 | h[255 & m]) ^ c[n++], q = (h[k >>> 24] << 24 | h[l >>> 16 & 255] << 16 | h[m >>> 8 & 255] << 8 | h[255 & j]) ^ c[n++], r = (h[l >>> 24] << 24 | h[m >>> 16 & 255] << 16 | h[j >>> 8 & 255] << 8 | h[255 & k]) ^ c[n++], m = (h[m >>> 24] << 24 | h[j >>> 16 & 255] << 16 | h[k >>> 8 & 255] << 8 | h[255 & l]) ^ c[n++], a[b] = p, a[b + 1] = q, a[b + 2] = r, a[b + 3] = m }, keySize: 8 });
                    a.AES = b._createHelper(c) }(), b.exports = f, b.exports.MessageClient = n, b.exports.Message = l, b.exports.Call = g, b.exports.CallClient = i, b.exports.Verification = p, b.exports.CallDetails = h, b.exports.MessageDeliveryInfo = m, b.exports.PAPIDefs = B
        }, { "../VERSION": 1, q: 15, "sinch-ticketgen": 16 }]
    }, {}, [17])(17)
});
