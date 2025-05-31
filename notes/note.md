
When to Mock?  
1. File System | fs.writeFile 
# Avoid writing to disk during tests

2. NetWorking/API | fetch or axios
# Avoid real HTTP requests

3. Database | db.query() =
# Avoid hitting real DBs

4. Time-based | Date.now, setTimeout
# Control timing

5. Random/UUID 
#Ensure Deterministic Results

6. Environment | process.env or console.log
# Avoid polluting real env/logs 



Testing Knowledge

case: fs.mkdir(absPath, { recursive: true })
test: mockMkdir( expect.stringContaining('__test__'), { recursive: true })
so this one to one matching of the real params for fs.mkdir

Alernatively
param2 => expect.objectContaining({ recursive: true })



Try/catch ?? 

When there is no try/catch block =>
1. bubble up ( rethrow automatically )
2. be caught by the caller ( if they use try/catch )
3. crash the app/test if unhandled

✅ Pros of not swallowing errors:
- keeps errors visible 
- lets the caller decide how to handle the error
- encourages writing robust outer logic (e.g., retry, fallback)

💡 "Fail fast and loud" is often preferred in utility code.


⚠️ When I Should Swallow or Handle Internally

1. Expect common, non-fatal errors (e.g., file already exists, EEXIST)
2. Want to return a fallback value or a specific error format
3. Are writing a wrapper utility that's meant to be fault-tolerant

Try/Catch shifts where errors are handled
- Without it, the caller handles errors ( clean seperation of concern)
- With it, I own the responsibility for handling/loging/responding

```
try {
    await doSomething()
} catch(err) {
    console.log('Something went wrong');
    return null // now the caller gets null - and maybe not realize something failed! 
}
```

In catch
- re-throw the original error?
- wrap it in a custom one? 
- log it? 
- swallow it? 


```
// 1. Rethrow the original error
try {
    do() 
} catch(err) {
    // maybe log or inspect, then rethrow
    throw err 
} 

// 2. Throw a custom error 
try {
    do() 
} catch(err) {
    throw new Error(`Failed: ${String(err)}`)
}
```