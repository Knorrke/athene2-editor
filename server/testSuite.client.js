/**
 * Created by benny on 08.06.15.
 */
var dnode = require('dnode');
var async = require('async');

var d = dnode.connect(7070);

var timestampsStart = [], timestampsEnd = [];
var i = 0;

d.on('remote', function (remote) {
    runTests(remote);
});

function runTests(remote) {
    timestampsStart[i] = new Date().getTime();
    var calls = Math.pow(i,3)*5 + 1,
        asyncTasks = [];
    for (var j = 0; j < calls; j++) {
        asyncTasks.push(function (pushCallback) {
            remote.render(getNewJSON(), function (output, exception, message) {
                //console.log(output, exception, message);
                pushCallback();
            });
        });
    }
    async.parallel(asyncTasks, function () {
        timestampsEnd[i] = new Date().getTime();
        console.log('Time used for %d call(s): %d ms. Average time: %d ms', calls, timestampsEnd[i] - timestampsStart[i], (timestampsEnd[i] - timestampsStart[i]) / calls);
        if (i < 4) {
            i++;
            runTests(remote);
        } else {
            console.log('finished');
        }
    });
}

function getNewJSON() {
    return '[[{&quot;col&quot;:12,&quot;content&quot;:&quot;|a|b|\\n|-|-|\\n|c|d|&quot;},{&quot;col&quot;:12,&quot;content&quot;:&quot;GAFE\\n\\n$$' + +Math.floor(Math.random() * 30) + '\\\\cdot' + Math.floor(Math.random() * 1500) + '\\\\cdot\\\\frac ' + Math.floor(Math.random() * 257) + 'x' + Math.floor(Math.random() * 100) + ' ' +
        ' ' + Math.floor(Math.random() * 42) + 'y-' + Math.floor(Math.random() * 30) + ' \\\\frac12*a`*b`+34567$$ text \\n noch mehr text&quot;}],[{&quot;col&quot;:8,&quot;content&quot;:&quot;ADAW&quot;},{&quot;col&quot;:16,&quot;content&quot;:&quot;OK&quot;}]]';
}