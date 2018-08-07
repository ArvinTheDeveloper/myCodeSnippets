	/// <summary>
    /// Retrieves the first found record. This snippet is for getting values from multi option sets, useful during plug-ins
    /// </summary>
    /// <param name="localContext">Plugin Context</param>
    /// <param name="query">Query to send</param>
    /// <returns>Target record</returns>
    public static string GetOptionSetText(Plugin.LocalPluginContext localContext, string entityName, string attributeName, int optionsetValue)
    {
        string optionsetText = string.Empty;
            
        OptionSetMetadata optionsetMetadata = OpportunityEntity.GetOptionSetMetadata(localContext, entityName, attributeName);
        if (optionsetMetadata != null)
        {
            foreach (OptionMetadata optionMetadata in optionsetMetadata.Options)
            {
                if (optionMetadata.Value == optionsetValue)
                {
                    optionsetText = optionMetadata.Label.UserLocalizedLabel.Label;
                    return optionsetText;
                }

            }
        }
            
        return optionsetText;
    }

    public static OptionSetMetadata GetOptionSetMetadata(Plugin.LocalPluginContext localContext, string entityName, string attributeName)
    {
        RetrieveAttributeRequest retrieveAttributeRequest = new RetrieveAttributeRequest();
        retrieveAttributeRequest.EntityLogicalName = entityName;
        retrieveAttributeRequest.LogicalName = attributeName;
        retrieveAttributeRequest.RetrieveAsIfPublished = true;

        RetrieveAttributeResponse retrieveAttributeResponse = (RetrieveAttributeResponse)localContext.OrganizationService.Execute(retrieveAttributeRequest);
        PicklistAttributeMetadata picklistAttributeMetadata = (PicklistAttributeMetadata)retrieveAttributeResponse.AttributeMetadata;
        return picklistAttributeMetadata.OptionSet;
    }