pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;
import "./oraclizeAPI-0.5.sol";

contract SLA is usingOraclize {
    bool private initialized;
    address private owner;

    mapping(bytes32 => uint8) uniqueMsgHashes;

    event ServicePaid(uint256 msgValue, uint256 currentPrice);
    event ViolationReported(Violation violation);

    event LogViolations(Violation[] violations);
    event LogViolationThresholds(uint8[] violationThresholds);

    event LogState(State state);
    event LogValidityPeriod(ValidityPeriod validityPeriod);

    struct Violation {
        uint8 violationType;
        uint8 violationSeverity;
    }

    struct ValidityPeriod {
        uint256 createdAt; // timestamp
        uint256 expiresAt; // timestamp
        uint256 validity; // days
    }

    struct State {
        bool isActivated;
        bool isTerminated;
        uint256 currentCompensation;
        uint8 violationCount;
    }

    struct sla {
        address payable customerAddress;
        address payable providerAddress;
        address monitorAddress;
        uint8 timeToMitigate; // minutes
        uint16 mitigationEfficiency; // percentage
        uint16 serviceAvailability; // percentage
        uint256 customerDeposit;
        uint256 price;
        bool paid;
        bool isTerminated;
        State state;
        Violation[] violations;
        ValidityPeriod validityPeriod;
        mapping(uint8 => mapping(uint8 => uint8)) compensationPercentages;
        uint8[] violationThresholds;
    }

    sla public currentSla;

    constructor() public payable {
        owner = msg.sender;
    }

    function init(
        uint256 price,
        address payable _customerAddress,
        address payable _providerAddress,
        address _monitorAddress,
        uint8 timeToMitigate,
        uint16 mitigationEfficiency,
        uint16 serviceAvailability,
        uint8[] memory compensationPercentages,
        uint8[] memory violationThresholds,
        uint256[3] memory validityData
    ) public {
        require(initialized == false && msg.sender == owner);
        initialized = true;

        currentSla.state.isTerminated = false;
        currentSla.state.isActivated = false;
        currentSla.state.currentCompensation = 0;
        currentSla.state.violationCount = 0;

        currentSla.price = price;
        currentSla.timeToMitigate = timeToMitigate;
        currentSla.mitigationEfficiency = mitigationEfficiency;
        currentSla.serviceAvailability = serviceAvailability;
        currentSla.customerAddress = _customerAddress;
        currentSla.providerAddress = _providerAddress;
        currentSla.monitorAddress = _monitorAddress;
        currentSla.validityPeriod.createdAt = validityData[0];
        currentSla.validityPeriod.expiresAt = validityData[1];
        currentSla.validityPeriod.validity = validityData[2];

        currentSla.compensationPercentages[0][0] = compensationPercentages[0];
        currentSla.compensationPercentages[0][1] = compensationPercentages[1];
        currentSla.compensationPercentages[0][2] = compensationPercentages[2];

        currentSla.compensationPercentages[1][0] = compensationPercentages[3];
        currentSla.compensationPercentages[1][1] = compensationPercentages[4];
        currentSla.compensationPercentages[1][2] = compensationPercentages[5];

        currentSla.compensationPercentages[2][0] = compensationPercentages[6];
        currentSla.compensationPercentages[2][1] = compensationPercentages[7];
        currentSla.compensationPercentages[2][2] = compensationPercentages[8];

        currentSla.violationThresholds = violationThresholds;

        // initOraclizeCallback(validityData[2]);
    }

    modifier requireActivated {
        require(currentSla.state.isActivated == true);
        _;
    }

    modifier callableOnce {
        require(initialized == false && msg.sender == owner);
        _;
    }

    function initOraclizeCallback(uint256 validityInDays) public {
        uint256 validityInSeconds = validityInDays * 24 * 60 * 60;
        oraclize_query(validityInSeconds, "URL", "");
    }

    function __callback(bytes32 myid, string memory result) public {
        require(msg.sender == oraclize_cbAddress());
        terminate();
    }

    function payForService() public payable {
        require(
            msg.value >= currentSla.price,
            "you have to pay a sufficient price"
        );
        if (msg.value >= currentSla.price) {
            currentSla.paid = true;
            currentSla.state.isActivated = true;
            currentSla.customerDeposit = msg.value;
            emit ServicePaid(msg.value, currentSla.price);
        }
    }

    function reportViolationFromAPI(
        bytes32 msgHash,
        uint8 v,
        bytes32 r,
        bytes32 s,
        Violation memory violation
    ) public requireActivated {
        address recoveredAddress = ecrecover(msgHash, v, r, s);
        // require(currentSla.monitorAddress == recoveredAddress);
        require(uniqueMsgHashes[msgHash] == 0);
        uniqueMsgHashes[msgHash] = 1;
        reportViolation(violation);
    }

    function reportViolation(Violation memory violation)
        private
        requireActivated
    {
        currentSla.state.violationCount += 1;
        currentSla.violations.push(violation);
        emit ViolationReported(violation);
    }

    function terminate() public {
        compensateCustomer();
        currentSla.state.isTerminated = true;
        selfdestruct(currentSla.providerAddress);
    }

    function compensateCustomer() private {
        updateCompensation();
        currentSla.customerAddress.transfer(
            currentSla.state.currentCompensation
        );
    }

    function updateCompensation() public {
        uint8 compensationPercentage = 0;
        for (uint8 i = 0; i < currentSla.violations.length; i++) {
            uint8 violationType = currentSla.violations[i].violationType;
            uint8 violationSeverity = currentSla.violations[i]
                .violationSeverity;
            compensationPercentage += currentSla
                .compensationPercentages[violationType][violationSeverity];
        }
        uint256 compensation = (currentSla.customerDeposit *
            compensationPercentage) / 100;
        if (compensation <= address(this).balance) {
            currentSla.state.currentCompensation = compensation;
        } else {
            terminate();
        }
    }

    function getViolations() public {
        emit LogViolations(currentSla.violations);
    }

    function getState() public {
        updateCompensation();
        emit LogState(currentSla.state);
    }

    function getValidityPeriod() public {
        emit LogValidityPeriod(currentSla.validityPeriod);
    }

    function getViolationThresholds() public {
        emit LogViolationThresholds(currentSla.violationThresholds);
    }
}
