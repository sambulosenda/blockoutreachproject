pragma solidity ^0.4.0;
contract MunicipalBallot {
    
    enum ProjectState  {Funded,FundRaising}
    
    struct Contributer{
        address contributerAddress;
        uint contributionAmtPrivate;
        uint contributionAmtMun;
        uint contribution;
    }
    
    struct Project{
        bytes32 name;
        uint cost;
        uint balance;
        //Contributer[] contributers;
        address initiater;
        uint projectId;
        ProjectState projectState;
    }
    
    Project[] public projects; // list of projects 
    
    address public chairperson; // chairperson
    enum BallotState { FundRaising, Successful , Inactive } // often used for state machine
    uint public numProjects = 0;
    //added
    uint public contractBalance = 0;
    mapping(address => uint256) public balanceOf;
    event FundTransfer(address backer, uint amount, bool isContribution);



    /// Create a new ballot with $(_numProposals) different proposals.
    function MunicipalBallot() {
        chairperson = msg.sender;
        //voters[chairperson].weight = 1;
        //proposals.length = _numProposals;
        //addProject("Project A",1000);
        //addProject("Project B",1000);
        //addProject("Project C",1000);
    }

    /// Function to Add Projects
    function addProject(bytes32 _name, uint _cost) {
        
        Project memory newProject;
        newProject.name = _name;
        newProject.cost = _cost;
        newProject.balance = 0;
        newProject.projectId = projects.length + 1;

        projects.push(newProject);

        numProjects++;
    }
    
    // Unimplemented feature: Copying of type struct MunicipalBallot.Contributer memory[] memory to storage not yet supported.

    
    // Contribute to Project
    function contributeToProject(uint projectId, uint amount, address contributer)
    {
        // later on, check for state 
        // later on, check the validation of the address
        Project project = projects[projectId];
        if (project.projectState != ProjectState.Funded) 
        {
            project.balance = project.balance + amount;
            
            if (project.balance >= project.cost) 
            {
                    // Change the state
                    project.projectState = ProjectState.Funded;
            }
        }
    }

    //added
    // The function without name is the default function that is called whenever anyone sends funds to a contract */
    // function () payable {
    //     uint amount = msg.value;
    //     balanceOf[msg.sender] = amount;
    //     contractBalance += amount;
    //     FundTransfer(msg.sender, amount, true);
    // }


    // project id off by 1
    function payProject(uint projectId) payable {
        uint amount = msg.value;
        balanceOf[msg.sender] = amount;
        contractBalance += amount;
        FundTransfer(msg.sender, amount, true);
        projects[projectId].balance = projects[projectId].balance + amount;
    }


    function getProjects() constant returns (bytes32[], uint[], uint[], uint[]) {

        uint length = projects.length;

        bytes32[] memory names = new bytes32[](length);
        uint[] memory costs = new uint[](length);
        uint[] memory balances = new uint[](length);
        uint[] memory projectIds = new uint[](length);

        for (uint i = 0; i < projects.length; i++) {
            Project memory currentProject;
            currentProject = projects[i];

            names[i] = currentProject.name;
            costs[i] = currentProject.cost;
            balances[i] = currentProject.balance;
            projectIds[i] = currentProject.projectId;
        }

        return (names, costs, balances, projectIds);
    }
    
    // [TO-DO] Write a method to pay people back
    
    //function fundedProjects() constant returns (uint8 winningProposal) {
    //    uint256 winningVoteCount = 0;
    //   for (uint8 proposal = 0; proposal < proposals.length; proposal++)
    //        if (proposals[proposal].voteCount > winningVoteCount) {
    //            winningVoteCount = proposals[proposal].voteCount;
    //            winningProposal = proposal;
    //        }
    //    }
}
