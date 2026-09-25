import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
test('rejects writes without touching the database',async()=>{
 const response=await worker.fetch(new Request('https://example.com/api/content',{method:'POST'}),{});
 assert.equal(response.status,405);assert.equal(response.headers.get('Allow'),'GET, HEAD');
});
test('returns only published data using read-only queries',async()=>{
 const queries=[];const env={DB:{prepare(sql){queries.push(sql);return {all:async()=>({results:[]})};}}};
 const response=await worker.fetch(new Request('https://example.com/api/content'),env);
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{photos:[],socials:[]});
 assert.match(queries[0],/published = 1/);assert.match(queries[1],/enabled = 1/);
});
test('unknown API path is a 404',async()=>assert.equal((await worker.fetch(new Request('https://example.com/api/missing'),{})).status,404));
test('database outage is a retryable 503 without internal details',async()=>{
 const r=await worker.fetch(new Request('https://example.com/api/content'),{DB:{prepare(){throw new Error('private database detail');}}});
 assert.equal(r.status,503);assert.equal(r.headers.get('Cache-Control'),'no-store');assert.doesNotMatch(await r.text(),/private database detail/);
});
