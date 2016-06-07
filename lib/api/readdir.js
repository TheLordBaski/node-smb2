

var SMB2Forge = require('../tools/smb2-forge')
  , SMB2Request = SMB2Forge.request
  ;
  var Long =  require('../tools/long.js').Long;
var FileTime = require('win32filetime');
/*
 * readdir
 * =======
 *
 * list the file / directory from the path provided:
 *
 *  - open the directory
 *
 *  - query directory content
 *
 *  - close the directory
 *
 */
module.exports = function(path, cb){
  var connection = this;
  // SMB2 open directory
  SMB2Request('open', {path:path}, connection, function(err, file){
    if(err) cb && cb(err);
    // SMB2 query directory
    else SMB2Request('query_directory', file, connection, function(err, files){
      if(err) cb && cb(err);
      // SMB2 close directory
      else SMB2Request('close', file, connection, function(err){
        cb && cb(
          null
        , files
            .map(function(v){/


              buffer = v.CreationTime;
              var low = buffer.readUInt32LE(0);
              var high = buffer.readUInt32LE(4);
              v.CreationTime = FileTime.toDate({low: low, high: high}).toISOString()

              buffer = v.LastAccessTime;
              var low = buffer.readUInt32LE(0);
              var high = buffer.readUInt32LE(4);
              v.LastAccessTime = FileTime.toDate({low: low, high: high}).toISOString()

              buffer = v.LastWriteTime;
              var low = buffer.readUInt32LE(0);
              var high = buffer.readUInt32LE(4);
              v.LastWriteTime = FileTime.toDate({low: low, high: high}).toISOString()

              buffer = v.ChangeTime;
              var low = buffer.readUInt32LE(0);
              var high = buffer.readUInt32LE(4);
              v.ChangeTime = FileTime.toDate({low: low, high: high}).toISOString()
               return {
                 fileChangeTime : v.ChangeTime,
                 fileLastAccessTime: v.LastAccessTime,
                 fileLastWriteTime: v.LastWriteTime,
                 fileCreationTime : v.CreationTime,
                 fileAttributes: v.FileAttributes,
                 filename: v.Filename
               };
              }) // get the filename only
            .filter(function(v){ return v!='.' && v!='..' }) // remove '.' and '..' values
        );
      });
    });
  });

}
