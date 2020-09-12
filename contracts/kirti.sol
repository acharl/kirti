pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;
import "./SLA.sol";

contract Kirti {
    address public owner;

    event ProviderRegistered(ServiceProvider provider, address sender);
    event ServiceRegistered(Service service, address sender);
    event MonitorRegistered(Monitor monitor, address sender);
    event CustomerRatingRegistered(CustomerRating rating);

    event SLAContractCreated(address contractAddress);
    struct SLADetails {
        uint8 timeToMitigate;
        uint16 mitigationEfficiency; // percentage, factor 1e4 => 99.99% = 9999
        uint16 serviceAvailability; // percentage, factor 1e4 => 99.99% = 9999
        uint8[] compensationPercentages;
        uint8[] violationThresholds;
    }

    struct SLAService {
        string serviceName;
        string providerName;
        address payable customerAddress;
        address payable providerAddress;
        address monitorAddress;
        string description;
        uint256 price;
        uint256 validity; // in days
        SLADetails slaDetails;
    }

    struct Service {
        string serviceName;
        string providerName;
        address payable providerAddress;
        string description;
        uint256 price;
        uint256 validity; // in days
        SLADetails slaDetails;
    }

    struct CustomerRating {
        address customerAddress;
        string serviceName;
        RatingScore ratingScore;
    }

    struct RatingScore {
        uint8 accurracy;
        uint8 usability;
        uint8 pricing;
        uint8 support;
        uint8 features;
        string ratingText;
    }

    struct ServiceProvider {
        string name;
        address providerAddress;
    }

    struct Monitor {
        string name;
        address monitorAddress;
    }

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner, "Sender not authorized.");
        _;
    }

    function registerService(Service memory service) public restricted() {
        emit ServiceRegistered(service, msg.sender);
    }

    function registerMonitor(Monitor memory monitor) public restricted() {
        emit MonitorRegistered(monitor, msg.sender);
    }

    function registerProvider(ServiceProvider memory provider)
        public
        restricted()
    {
        emit ProviderRegistered(provider, msg.sender);
    }

    function registerCustomerRating(CustomerRating memory rating)
        public
        restricted()
    {
        require(
            rating.ratingScore.accurracy <= 10 &&
                rating.ratingScore.usability <= 10 &&
                rating.ratingScore.pricing <= 10 &&
                rating.ratingScore.support <= 10 &&
                rating.ratingScore.features <= 10
        );
        emit CustomerRatingRegistered(rating);
    }

    function getContractAddress(SLA newContract) public pure returns (address) {
        return address(newContract);
    }

    function newSLA(SLAService memory service)
        public
        restricted()
        returns (SLA newContract)
    {
        uint256 expiresAt = block.timestamp + (service.validity * 24 * 60 * 60);
        uint256[3] memory validityData = [
            block.timestamp,
            expiresAt,
            service.validity * 24 * 60 * 60
        ];

        newContract = new SLA();
        newContract.init(
            service.price,
            service.customerAddress,
            service.providerAddress,
            service.monitorAddress,
            service.slaDetails.timeToMitigate,
            service.slaDetails.mitigationEfficiency,
            service.slaDetails.serviceAvailability,
            service.slaDetails.compensationPercentages,
            service.slaDetails.violationThresholds,
            validityData
        );
        address contractAddress = getContractAddress(newContract);
        emit SLAContractCreated(contractAddress);
        return newContract;
    }
}
