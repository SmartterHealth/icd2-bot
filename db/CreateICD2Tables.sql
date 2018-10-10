-- TABLE
USE [ICD2DB] 

DROP TABLE IF EXISTS [ICD10Codes]

CREATE TABLE [dbo].[ICD10Codes](
	[code] [nvarchar](50) NOT NULL,
	[hipaa] [bit] NULL,
	[description] [nvarchar](500) NULL,
	[long_description] [varchar](500) NULL,
	[chapter] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
