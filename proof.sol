pragma solidity 0.5.6;

contract Proof
{
    // set timestamp and owner
    struct FileDetails
    {
        uint timestamp;
        string owner;
    }
    mapping (string => FileDetails) files;
    event logFileAddedStatus(bool status, uint timestamp, string owner, string fileHash);
    
    // store the owner of file at the block
    function set(string owner, string fileHash) public
    {
        if(files[fileHash].timestamp == 0)
        {
            files[fileHash] = FileDetails(block.timestamp, owner);
            logFileAddedStatus(true, block.timestamp, owner, fileHash);
        }
        else
        {
            logFileAddedStatus(false, block.timestamp, owner, fileHash);
        }
    }
    // get file information
    function get(string fileHash) public returns (uint timestamp, string owner)
    {
        return (files[fileHash].timestamp, files[fileHash].owner);
    }
}