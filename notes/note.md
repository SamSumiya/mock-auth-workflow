
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